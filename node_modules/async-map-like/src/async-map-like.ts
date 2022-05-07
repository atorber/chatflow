/* eslint-disable no-use-before-define */
import type { MapLike } from './map-like.js'

type MapLikeNoSync<K, V> = Omit<
  MapLike<K, V>,
  typeof Symbol.toStringTag | typeof Symbol.iterator
>

type IteratorMethod = 'entries' | 'keys' | 'values'
type GetMethod      = 'get'
type AnyFunction    = (...args: any) => any

type AsyncifyIterator<R extends IterableIterator<any>> = R extends IterableIterator<infer I>
  ? AsyncIterableIterator<I>
  : never

/**
 * Asyncify Functions
 */
type AsyncifyIteratorFunction <T extends AnyFunction> = (...args: Parameters<T>) => AsyncifyIterator<ReturnType<T>>
type AsyncifyBooleanFunction  <T extends AnyFunction> = (...args: Parameters<T>) => Promise<boolean>
type AsyncifyMapFunction<K, V, T extends AnyFunction> = (...args: Parameters<T>) => Promise<AsyncMapLike<K, V>>
type AsyncifySimpleFunction   <T extends AnyFunction> = (...args: Parameters<T>) => Promise<ReturnType<T>>

type Asyncify<NAME, T> = T extends AnyFunction ?
  /**
   * Methods
   */
      NAME extends IteratorMethod                   ? AsyncifyIteratorFunction<T>
    : NAME extends GetMethod                        ? AsyncifySimpleFunction<T>
    : NAME extends Symbol                           ? AsyncifyIteratorFunction<T>
    : ReturnType<T> extends boolean                 ? AsyncifyBooleanFunction<T>
    : ReturnType<T> extends Map<infer IK, infer IV> ? AsyncifyMapFunction<IK, IV, T>
    : AsyncifySimpleFunction<T>
  /**
   * Properties
   */
  : Promise<T>

type AsyncMapBase<K, V> = {
  [N in keyof MapLikeNoSync<K, V>]: Asyncify<N, MapLikeNoSync<K, V>[N]>
}

interface AsyncMapIterator<K, V> {
  /**
   * Huan(202111): we have removed the `[Symbol.iterator]`, and add the below `[Symbol.asyncIterator]` for Async
   */
  [Symbol.asyncIterator]: () => AsyncifyIterator<
    ReturnType<
      Map<K, V>[typeof Symbol.iterator]
    >
  >
}

type AsyncMapLike<K, V> = AsyncMapBase<K, V> & AsyncMapIterator<K, V>

export type {
  AsyncMapLike,
}
