import rimraf    from 'rimraf'
// import encoding  from 'encoding-down'
// import leveldown from 'leveldown'
// import levelup   from 'levelup'
import level        from 'level'
import levelErrors  from 'level-errors'

// https://github.com/rollup/rollup/issues/1267#issuecomment-296395734
// const rimraf    = (<any>rimrafProxy).default    || rimrafProxy
// const encoding  = (<any>encodingProxy).default  || encodingProxy
// // const leveldown = (<any>leveldownProxy).default || leveldownProxy
// const levelup   = (<any>levelupProxy).default   || levelupProxy

import type {
  AsyncMapLike,
}                 from 'async-map-like'

import {
  log,
  VERSION,
}             from './config.js'

export interface IteratorOptions {
  gt?      : any,
  gte?     : any,
  lt?      : any,
  lte?     : any,
  reverse? : boolean,
  limit?   : number,

  prefix?  : any,
}

export class FlashStore<K = any, V = any> implements AsyncMapLike<K, V> {

  static VERSION = VERSION

  private levelDb: level.LevelDB<K, V>

  /**
   * FlashStore is a Key-Value database tool and makes using leveldb more easy for Node.js
   *
   * Creates an instance of FlashStore.
   * @param {string} [workdir=path.join(appRoot, 'flash-store.workdir')]
   * @example
   * import { FlashStore } from 'flash-store'
   * const flashStore = new FlashStore('flashstore.workdir')
   */
  constructor (
    public workdir: string,
  ) {
    log.verbose('FlashStore', 'constructor(%s)', workdir)

    /**
     * `valueEncoding` is a `encoding-down` options.
     *  See: https://github.com/Level/encoding-down#db--requireencoding-downdb-options
     */
    const levelDb = level(workdir, {
      valueEncoding: 'json',
    })
    levelDb.setMaxListeners(17)  // default is Infinity

    this.levelDb = levelDb
  }

  public version (): string {
    return VERSION
  }

  /**
   * Set data in database
   *
   * @param {K} key
   * @param {V} value
   * @returns {Promise<void>}
   * @example
   * await flashStore.put(1, 1)
   */
  public async set (key: K, value: V): Promise<AsyncMapLike<K, V>> {
    log.verbose('FlashStore', 'set(%s, %s)', key, typeof value)
    log.silly('FlashStore', 'set(%s, %s)', key, JSON.stringify(value))
    await this.levelDb.put(key, value)
    return this
  }

  /**
   * Get value from database by key
   *
   * @param {K} key
   * @returns {(Promise<V | null>)}
   * @example
   * console.log(await flashStore.get(1))
   */
  public async get (key: K): Promise<V | undefined> {
    log.verbose('FlashStore', 'get(%s)', key)
    try {
      const val = await this.levelDb.get(key)
      /**
       * We must `await` inside to
       *  catch the `NotFoundError`
       */
      return val
    } catch (e) {
      if (e instanceof levelErrors.NotFoundError) {
        return undefined
      }
      throw e
    }
  }

  /**
   * Del data by key
   *
   * @param {K} key
   * @returns {Promise<void>}
   * @example
   * await flashStore.del(1)
   */
  // public async del (key: K): Promise<void> {
  //   log.verbose('FlashStore', '`del()` DEPRECATED. use `delete()` instead')
  //   await this.delete(key)
  // }

  public async delete (key: K): Promise<boolean> {
    log.verbose('FlashStore', 'delete(%s)', key)
    await this.levelDb.del(key)
    // TODO: `del` returns `true` or `false`
    return true
  }

  /**
   * @typedef IteratorOptions
   *
   * @property { any }      gt       - Matches values that are greater than a specified value
   * @property { any }      gte      - Matches values that are greater than or equal to a specified value.
   * @property { any }      lt       - Matches values that are less than a specified value.
   * @property { any }      lte      - Matches values that are less than or equal to a specified value.
   * @property { boolean }  reverse  - Reverse the result set
   * @property { number }   limit    - Limits the number in the result set.
   * @property { any }      prefix   - Make the same prefix key get together.
   */

  /**
   * Find keys by IteratorOptions
   *
   * @param {IteratorOptions} [options={}]
   * @returns {AsyncIterableIterator<K>}
   * @example
   * const flashStore = new FlashStore('flashstore.workdir')
   * for await(const key of flashStore.keys({gte: 1})) {
   *   console.log(key)
   * }
   */
  public async * keys (options: IteratorOptions = {}): AsyncIterableIterator<K> {
    log.verbose('FlashStore', 'keys()')

    // options = Object.assign(options, {
    //   keys   : true,
    //   values : false,
    // })

    if (options.prefix) {
      if (options.gte || options.lte) {
        throw new Error('can not specify `prefix` with `gte`/`lte` together.')
      }
      options.gte = options.prefix
      options.lte = options.prefix + '\xff'
    }

    for await (const [key] of this.entries(options)) {
      yield key
    }
  }

  /**
   * Find all values
   *
   * @returns {AsyncIterableIterator<V>}
   * @example
   * const flashStore = new FlashStore('flashstore.workdir')
   * for await(const value of flashStore.values()) {
   *   console.log(value)
   * }
   */
  public async * values (options: IteratorOptions = {}): AsyncIterableIterator<V> {
    log.verbose('FlashStore', 'values()')

    // options = Object.assign(options, {
    //   keys   : false,
    //   values : true,
    // })

    for await (const [, value] of this.entries(options)) {
      yield value
    }

  }

  /**
   * Get the size of the database
   * @returns {Promise<number>}
   * @example
   * const size = await flashStore.size
   * console.log(`database size: ${size}`)
   */
  // * @deprecated use property `size` instead
  // public async count (): Promise<number> {
  //   log.warn('FlashStore', '`count()` DEPRECATED. use `size()` instead.')
  //   const size = await this.size
  //   return size
  // }

  public get size (): Promise<number> {
    log.verbose('FlashStore', 'size()')

    /* eslint no-async-promise-executor: 0 */
    /**
     * Get the total number (size) of the LevelDB keys #96
     *  - https://github.com/huan/flash-store/issues/96
     *
     * TODO: is there a better way to count all items from the db?
     */
    return new Promise<number>(async (resolve, reject) => {
      try {
        let count = 0
        for await (const _ of this) {
          count++
        }
        resolve(count)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * FIXME: use better way to do this
   */
  public async has (key: K): Promise<boolean> {
    const val = await this.get(key)
    return !!val
  }

  /**
   * TODO: use better way to do this with leveldb
   */
  public async clear (): Promise<void> {
    for await (const key of this.keys()) {
      await this.delete(key)
    }
  }

  get [Symbol.toStringTag] () {
    return Promise.resolve('FlashStore')
  }

  [Symbol.iterator] (): AsyncIterableIterator<[K, V]> {
    log.verbose('FlashStore', '[Symbol.iterator]()')
    /**
     * Huan(202108): what is this???
     *  does it equals to `entries()`?
     */
    return this.entries()
  }

  /**
   * @private
   */
  public async * entries (options?: IteratorOptions): AsyncIterableIterator<[K, V]> {
    log.verbose('FlashStore', '*entries(%s)', JSON.stringify(options))

    const iterator = (this.levelDb as any).db.iterator(options)

    while (true) {
      const pair = await new Promise<[K, V] | null>((resolve, reject) => {
        iterator.next(function (err: any, key: K, val: V) {
          if (err) {
            reject(err)
          }
          if (!key && !val) {
            return resolve(null)
          }
          // if (val) {
          //   val = JSON.parse(val as any)
          // }
          return resolve([key, val])
        })
      })
      if (!pair) {
        break
      }
      yield pair
    }
  }

  public async * [Symbol.asyncIterator] (): AsyncIterableIterator<[K, V]> {
    log.verbose('FlashStore', '*[Symbol.asyncIterator]()')
    yield * this.entries()
  }

  /**
   * @private
   */
  // public async * streamAsyncIterator (): AsyncIterator<[K, V]> {
  //   log.warn('FlashStore', 'DEPRECATED *[Symbol.asyncIterator]()')

  //   const readStream = this.levelDb.createReadStream()

  //   const endPromise = new Promise<false>((resolve, reject) => {
  //     readStream
  //       .once('end',  () => resolve(false))
  //       .once('error', reject)
  //   })

  //   let pair: [K, V] | false

  //   do {
  //     const dataPromise = new Promise<[K, V]>(resolve => {
  //       readStream.once('data', (data: any) => resolve([data.key, data.value]))
  //     })

  //     pair = await Promise.race([
  //       dataPromise,
  //       endPromise,
  //     ])

  //     if (pair) {
  //       yield pair
  //     }

  //   } while (pair)

  // }

  async forEach (
    callbackfn: (
      value: V,
      key: K,
      // map: TestAsyncMapLike,
      // FIXME(huan) 202007: we have to use any at here, because the typing system is very hard to
      //  rename `Map` to `TestAsyncMapLike` in this method function parameters.
      map: any,
    ) => void,
    thisArg?: any,
  ): Promise<void> {
    log.verbose('FlashStore', 'forEach()')

    for await (const [key, value] of this) {
      callbackfn.call(thisArg, value, key, this)
    }
  }

  public async close (): Promise<void> {
    log.verbose('FlashStore', 'close()')
    await this.levelDb.close()
  }

  /**
   * Destroy the database
   *
   * @returns {Promise<void>}
   */
  public async destroy (): Promise<void> {
    log.verbose('FlashStore', 'destroy()')
    await this.levelDb.close()
    await new Promise(resolve => rimraf(this.workdir, resolve))
  }

}

export default FlashStore
