import { OperatorFunction } from '../../interfaces';
/**
 * Creates a buffer with a shared view over the source sequence, causing each iterator to fetch the next element
 * from the source sequence.
 *
 * @template TSource Source sequence element type.
 * @returns {OperatorAsyncFunction<TSource, TSource>} Buffer enabling each enumerator to retrieve elements from the shared source sequence.
 */
export declare function share<TSource>(): OperatorFunction<TSource, TSource>;
/**
 * Shares the source sequence within a selector function where each iterator can fetch the next element from the
 * source sequence.
 *
 * @template TSource Source sequence element type.
 * @template TResult Result sequence element type.
 * @param {((value: Iterable<TSource>) => Iterable<TResult>)} [selector] Selector function with shared access
 * to the source sequence for each iterator.
 * @returns {OperatorAsyncFunction<TSource, TResult>} Sequence resulting from applying the selector function to the
 * shared view over the source sequence.
 */
export declare function share<TSource, TResult>(selector?: (value: Iterable<TSource>) => Iterable<TResult>): OperatorFunction<TSource, TResult>;
