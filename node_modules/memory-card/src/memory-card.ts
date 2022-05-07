/* eslint-disable no-use-before-define */
import type { AsyncMapLike } from 'async-map-like'

import {
  log,
  VERSION,
}                       from './config.js'
import {
  getStorage,
  StorageBackend,
  StorageBackendOptions,
}                         from './storage/mod.js'
import type {
  MemoryCardPayload,
}                       from './types.js'

export const NAMESPACE_MULTIPLEX_SEPRATOR = '\r'
export const NAMESPACE_KEY_SEPRATOR       = '\n'

const NAMESPACE_MULTIPLEX_SEPRATOR_REGEX = new RegExp(NAMESPACE_MULTIPLEX_SEPRATOR)
const NAMESPACE_KEY_SEPRATOR_REGEX       = new RegExp(NAMESPACE_KEY_SEPRATOR)

export interface MemoryCardOptions {
  name?           : string,
  storageOptions? : StorageBackendOptions,
  // //////////
  multiplex?: {
    parent : MemoryCard,
    name   : string,
  }
}

export interface MemoryCardJsonObject {
  payload: MemoryCardPayload,
  options: MemoryCardOptions,
}

export class MemoryCard implements AsyncMapLike<any, any> {

  /**
   *
   *
   * Static
   *
   *
   */
  static VERSION = VERSION

  static fromJSON (textOrObj: string | MemoryCardJsonObject): AsyncMapLike<any, any> {
    log.verbose('MemoryCard', 'static fromJSON(...)')

    let jsonObj: MemoryCardJsonObject

    if (typeof textOrObj === 'string') {
      jsonObj = JSON.parse(textOrObj)
    } else {
      jsonObj = textOrObj
    }

    const card = new this(jsonObj.options)
    card.payload = jsonObj.payload

    return card
  }

  protected static multiplex<T extends typeof MemoryCard> (
    this: T,
    memory : MemoryCard,
    name   : string,
  ): T['prototype'] {
    log.verbose('MemoryCard', 'static multiplex(%s, %s)', memory, name)

    // if (!memory.options) {
    //   throw new Error('can not multiplex a un-named MemoryCard')
    // }

    const subMemory = new this({
      ...memory.options,
      multiplex: {
        name,
        parent: memory,
      },
    })
    return subMemory
  }

  /**
   *
   *
   * Instance
   *
   *
   */
  name?: string

  protected parent?           : MemoryCard
  protected payload?          : MemoryCardPayload
  protected storage?          : StorageBackend
  protected multiplexNameList : string[]

  private options?: MemoryCardOptions

  constructor (
    options?: string | MemoryCardOptions,
  ) {
    log.verbose('MemoryCard', 'constructor(%s)',
      JSON.stringify(options),
    )

    if (typeof options === 'string') {
      options = { name: options }
    }

    this.options = options
    this.name    = options && options.name

    if (options && options.multiplex) {
      this.parent   = options.multiplex.parent
      this.payload  = this.parent.payload
      this.multiplexNameList = [
        ...this.parent.multiplexNameList,
        options.multiplex.name,
      ]
    } else {
      // payload should be undefined before load()
      this.payload = undefined

      this.multiplexNameList = []
    }
  }

  toString () {
    let mpString = ''
    if (this.multiplexNameList.length > 0) {
      mpString = this.multiplexNameList
        .map(mpName => `.multiplex(${mpName})`)
        .join('')
    }

    return `MemoryCard<${this.options?.name ?? ''}>${mpString}`
  }

  version (): string {
    return VERSION
  }

  private async getStorage (): Promise<undefined | StorageBackend> {
    log.verbose('MemoryCard', 'getStorage() for storage type: %s',
      (this.options
        && this.options.storageOptions
        && this.options.storageOptions.type
      ) || 'N/A',
    )

    if (!this.options) {
      return
    }

    const storage = await getStorage(
      this.options.name,
      this.options.storageOptions,
    )
    return storage
  }

  async load (): Promise<void> {
    log.verbose('MemoryCard', 'load() from storage: %s', this.storage || 'N/A')

    if (this.isMultiplex()) {
      log.verbose('MemoryCard', 'load() should not be called on a multiplex MemoryCard. NOOP')
      return
    }

    if (this.payload) {
      throw new Error('memory had already loaded before.')
    }

    if (!this.storage) {
      this.storage = await this.getStorage()
    }

    if (this.storage) {
      this.payload = await this.storage.load()
    } else {
      log.verbose('MemoryCard', 'load() no storage')
      this.payload = {}
    }
  }

  async save (): Promise<void> {
    log.verbose('MemoryCard', 'save()')

    if (this.isMultiplex()) {
      if (!this.parent) {
        throw new Error('multiplex memory no parent')
      }
      return this.parent.save()
    }

    log.verbose('MemoryCard', '<%s>%s save() to %s',
      this.name || '',
      this.multiplexPath(),
      this.storage || 'N/A',
    )

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    if (!this.storage) {
      log.verbose('MemoryCard', 'save() no storage, NOOP')
      return
    }

    await this.storage.save(this.payload)
  }

  /**
   *
   * Multiplexing related functions START
   *
   */
  protected isMultiplexKey (key: string): boolean {
    if (NAMESPACE_MULTIPLEX_SEPRATOR_REGEX.test(key)
        && NAMESPACE_KEY_SEPRATOR_REGEX.test(key)
    ) {
      const namespace = this.multiplexNamespace()
      return key.startsWith(namespace)
    }
    return false
  }

  protected multiplexNamespace (): string {
    if (!this.isMultiplex()) {
      throw new Error('not a multiplex memory')
    }

    const namespace = NAMESPACE_MULTIPLEX_SEPRATOR
      + this.multiplexNameList.join(NAMESPACE_MULTIPLEX_SEPRATOR)
    return namespace
  }

  protected resolveKey (name: string): string {
    if (this.isMultiplex()) {
      const namespace = this.multiplexNamespace()
      return [
        namespace,
        name,
      ].join(NAMESPACE_KEY_SEPRATOR)
    } else {
      return name
    }
  }

  isMultiplex (): boolean {
    return this.multiplexNameList.length > 0
  }

  protected multiplexPath (): string {
    return this.multiplexNameList.join('/')
  }

  multiplex (name: string): this {
    log.verbose('MemoryCard', 'multiplex(%s)', name)

    // FIXME: as any ?
    return (this.constructor as any).multiplex(this, name)
  }

  /**
   *
   * Multiplexing related functions END
   *
   */

  async destroy (): Promise<void> {
    log.verbose('MemoryCard', 'destroy() storage: %s', this.storage || 'N/A')

    if (this.isMultiplex()) {
      throw new Error('can not destroy on a multiplexed memory')
    }

    await this.clear()

    if (this.storage) {
      await this.storage.destroy()
      this.storage = undefined
    }

    // to prevent to use a destroied card
    this.payload = undefined
  }

  /**
   *
   * ES6 Map API (Async Version)
   *
   * BEGIN
   *
   */

  /**
   * size
   */
  get size (): Promise<number> {
    log.verbose('MemoryCard', '<%s> size', this.multiplexPath())

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    let count

    if (this.isMultiplex()) {
      count = Object.keys(this.payload)
        .filter(key => this.isMultiplexKey(key))
        .length
    } else {
      count = Object.keys(this.payload).length
    }
    return Promise.resolve(count)
  }

  async get<T = any> (name: string): Promise<undefined | T> {
    log.verbose('MemoryCard', '<%s> get(%s)', this.multiplexPath(), name)

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    const key = this.resolveKey(name)

    return this.payload[key] as any
  }

  async set<T = any> (name: string, data: T): Promise<this> {
    log.verbose('MemoryCard', '<%s> set(%s, %s)', this.multiplexPath(), name, data)

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    const key = this.resolveKey(name)

    this.payload[key] = data as any

    return this
  }

  async * [Symbol.asyncIterator]<T = any> (): AsyncIterableIterator<[string, T]> {
    log.verbose('MemoryCard', '<%s> *[Symbol.asyncIterator]()', this.multiplexPath())
    yield * this.entries()
  }

  async * entries<T = any> (): AsyncIterableIterator<[string, T]> {
    log.verbose('MemoryCard', '<%s> *entries()', this.multiplexPath())

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    for await (const relativeKey of this.keys()) {
      const absoluteKey = this.resolveKey(relativeKey)
      const data: T     = this.payload[absoluteKey] as any

      const pair: [string, T] = [relativeKey, data]
      yield pair
    }
  }

  async clear (): Promise<void> {
    log.verbose('MemoryCard', '<%s> clear()', this.multiplexPath())

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    if (this.isMultiplex()) {
      for (const key in this.payload) {
        if (this.isMultiplexKey(key)) {
          delete this.payload[key]
        }
      }
    } else {
      this.payload = {}
    }
  }

  async delete (name: string): Promise<boolean> {
    log.verbose('MemoryCard', '<%s> delete(%s)', this.multiplexPath(), name)

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    const key = this.resolveKey(name)

    if (key in this.payload) {
      delete this.payload[key]
      return true
    } else {
      return false
    }
  }

  async has (key: string): Promise<boolean> {
    log.verbose('MemoryCard', '<%s> has(%s)', this.multiplexPath(), key)

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    const absoluteKey = this.resolveKey(key)
    return absoluteKey in this.payload
  }

  async * keys (): AsyncIterableIterator<string> {
    log.verbose('MemoryCard', '<%s> keys()', this.multiplexPath())

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    for (const key of Object.keys(this.payload)) {
      // console.log('key', key)
      if (this.isMultiplex()) {
        if (this.isMultiplexKey(key)) {
          const namespace = this.multiplexNamespace()
          // `+1` means there's another NAMESPACE_KEY_SEPRATOR we need to trim
          const mpKey = key.substr(namespace.length + 1)
          yield mpKey
        }
        continue
      }
      yield key
    }
  }

  async * values<T = any> (): AsyncIterableIterator<T> {
    log.verbose('MemoryCard', '<%s> values()', this.multiplexPath())

    if (!this.payload) {
      throw new Error('no payload, please call load() first.')
    }

    for await (const relativeKey of this.keys()) {
      const absoluteKey = this.resolveKey(relativeKey)
      yield this.payload[absoluteKey] as any
    }
  }

  async forEach<T> (
    callbackfn: (
      value: T,
      key: string,
      map: any,
    ) => void,
    thisArg?: any,
  ): Promise<void> {
    for await (const [key, value] of this.entries()) {
      callbackfn.call(thisArg, value, key, this)
    }
  }

  /**
   *
   * ES6 Map API (Async Version)
   *
   * END
   *
   */

}

export default MemoryCard
