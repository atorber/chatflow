#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test }  from 'tstest'

import type { AsyncMapLike } from './async-map-like.js'

test('AsyncMapLike Interface via object', async (t) => {
  const mapCollection = {
    clear   : async ()         : Promise<void> => {},
    delete  : async (key: any) : Promise<boolean> => { return !!key },
    forEach : async (
      callbackfn: (
        value: any,
        key: any,
        map: Map<any, any>
      ) => void,
      thisArg?: any,
    ): Promise<void> => { void callbackfn; void thisArg },
    get  : async (_: any)                   : Promise<any> => {},
    has  : async (key: any)                 : Promise<boolean> => !!key,
    set  : async function (_: any, __: any) : Promise<any> { return ({} as any) },
    size : Promise.resolve(42),
  }

  const mapIterable = {
    entries           : () : AsyncIterableIterator<[any, any]> => { return {} as any },
    keys              : () : AsyncIterableIterator<any> => { return {} as any },
    values            : () : AsyncIterableIterator<any> => { return {} as any },
    [Symbol.asyncIterator]: () : AsyncIterableIterator<[any, any]> => { return {} as any },
  }

  const mapLike: AsyncMapLike<any, any> = {
    ...mapCollection,
    ...mapIterable,
  }

  t.ok(mapLike, 'should be assign-able from ES6 Map to our MapLike')
})

test('AsyncMapLike Interface via class', async (t) => {
  class TestAsyncMapLike implements AsyncMapLike<string, number> {

    constructor () {}

    /**
     * Collections
     */
    async clear (): Promise<void> {}
    async delete (key: string): Promise<boolean> { return !!key }
    async forEach (
      callbackfn: (
        value: number,
        key: string,
        // map: TestAsyncMapLike,
        // FIXME(huan) 202007: we have to use any at here, because the typing system is very hard to
        //  rename `Map` to `TestAsyncMapLike` in this method function parameters.
        map: any,
      ) => void,
      thisArg?: any,
    ): Promise<void> { void callbackfn; void thisArg }

    async get (key: string)                : Promise<number> { void key; return 42 }
    async has (key: string)                : Promise<boolean> { return !!key }
    async set (key: string, value: number) : Promise<this> { void key; void value; return this }
    get size () { return Promise.resolve(42) }

    /**
     * Iterables
     */
    entries           () : AsyncIterableIterator<[string, number]> { return {} as any }
    keys              () : AsyncIterableIterator<string> { return {} as any }
    values            () : AsyncIterableIterator<number> { return {} as any }
    [Symbol.asyncIterator] () : AsyncIterableIterator<[any, any]> { return {} as any }

  }

  const mapLike = new TestAsyncMapLike()
  t.ok(mapLike, 'should be implement-able from AsyncMapLike')
})

test('AsyncMapLike Interface via class generic', async (t) => {
  class TestAsyncMapLike<K, V> implements AsyncMapLike<K, V> {

    constructor () {}

    /**
     * Collections
     */
    async clear ()        : Promise<void> {}
    async delete (key: K) : Promise<boolean> { return !!key }
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
    ): Promise<void> { void callbackfn; void thisArg }

    async get (key: K)           : Promise<V> { void key; return 42 as any as V }
    async has (key: K)           : Promise<boolean> { return !!key }
    async set (key: K, value: V) : Promise<this> { void key; void value; return this }
    get size () { return Promise.resolve(42) }

    /**
     * AsyncIterables
     */
    entries           () : AsyncIterableIterator<[K, V]> { return {} as any }
    keys              () : AsyncIterableIterator<K> { return {} as any }
    values            () : AsyncIterableIterator<V> { return {} as any }
    [Symbol.asyncIterator] () : AsyncIterableIterator<[any, any]> {
      return {
        [Symbol.asyncIterator]: this[Symbol.asyncIterator],
        next: () => Promise.resolve({ done: true, value: undefined }),
      }
    }

  }

  const mapLike = new TestAsyncMapLike<string, number>()
  t.ok(mapLike, 'should be implement-able from AsyncMapLike')

  /**
   * Just check for the types
   */
  for await (const kv of mapLike) { void kv }
})
