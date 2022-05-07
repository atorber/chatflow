import cuid from 'cuid'
import {
  StateSwitch,
}               from 'state-switch'

import {
  log,
}                   from './config.js'

import {
  FlashStore,
}             from './flash-store.js'

export class FlashStoreSync<K = any, V = any> implements Map<K, V> {

  static VERSION = FlashStore.VERSION

  private cacheMap   : Map<K,        V>
  private flashStore : FlashStore<K, V>

  private asyncBusyState: StateSwitch
  private asyncBusyDict: {
    [id: string]: Promise<void>,
  }

  constructor (
    public workdir?: string,
  ) {
    log.verbose('CacheStore', 'constructor(%s)', workdir)

    workdir = workdir || '.flash-store-sync'

    this.asyncBusyDict = {}
    this.asyncBusyState   = new StateSwitch(
      'Busy:' + workdir.split('/').pop(), // get the latest folder name
      { log },
    )

    this.cacheMap   = new Map<K,        V>()
    this.flashStore = new FlashStore<K, V>(workdir)

    this.asyncBusyAdd(this.loadStoreToCache())

  }

  private async loadStoreToCache (): Promise<void> {
    this.cacheMap.clear()
    for await (const [key, val] of this.flashStore) {
      this.cacheMap.set(key, val)
    }
  }

  private asyncBusyAdd (task: Promise<any>): void {
    this.asyncBusyState.on(true)

    const id = cuid()
    this.asyncBusyDict[id] = task.finally(() => {
      delete this.asyncBusyDict[id]
      if (Object.keys(this.asyncBusyDict).length <= 0) {

        this.asyncBusyState.off(true)

      }
    })
  }

  public version (): string {
    return this.flashStore.version()
  }

  /**
   *
   * Async methods:
   *
   */
  public async close (): Promise<void> {
    await this.ready()
    await this.flashStore.close()
  }

  public async destroy (): Promise<void> {
    // this.clear()
    // add destroy task at the end of the event loop
    this.asyncBusyState.ready('off')
      .then(
        () => this.flashStore.destroy(),
      ).catch(console.error)
  }

  public async ready (): Promise<void> {
    await this.asyncBusyState.ready('off')
  }

  /*******************************************************
   *
   *
   * The following methods is all for ES6 Map Interface
   *
   *
   *******************************************************/

  public get size (): number {
    return this.cacheMap.size
  }

  get [Symbol.toStringTag] () {
    return 'FlashStoreSync' as any as 'Map'
  }

  public [Symbol.iterator] () {
    return this.cacheMap[Symbol.iterator]()
  }

  public entries () {
    return this.cacheMap.entries()
  }

  public keys () {
    return this.cacheMap.keys()
  }

  public values () {
    return this.cacheMap.values()
  }

  public clear (): void {
    this.asyncBusyAdd(this.flashStore.clear())
    return this.cacheMap.clear()
  }

  public delete (key: K): boolean {
    this.asyncBusyAdd(this.flashStore.delete(key))
    return this.cacheMap.delete(key)
  }

  /**
   * Do not mutate the key/value in the forEach loop!
   */
  public forEach (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    /**
     * 1. no need to call flashStore
     * 2. callbackfn should not mutate the data, or the data will be lost sync between cache & store
     */
    return this.cacheMap.forEach(callbackfn, thisArg)
  }

  public get (key: K): V | undefined {
    return this.cacheMap.get(key)
  }

  public has (key: K): boolean {
    return this.cacheMap.has(key)
  }

  public set (key: K, value: V): this {
    this.asyncBusyAdd(this.flashStore.set(key, value))
    this.cacheMap.set(key, value)
    return this
  }

}

export default FlashStoreSync
