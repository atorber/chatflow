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

export type AsyncMapLike<K, V> = {
  [N in keyof Map<K, V>]: Asyncify<N, Map<K, V>[N]>
}
