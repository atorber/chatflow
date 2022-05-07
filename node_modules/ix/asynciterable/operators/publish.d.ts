import { OperatorAsyncFunction } from '../../interfaces';
/**
 * Creates a buffer with a view over the source sequence, causing each iterator to obtain access to the
 * remainder of the sequence from the current index in the buffer.
 *
 * @template TSource Source sequence element type.
 * @returns {OperatorAsyncFunction<TSource, TSource>} Buffer enabling each iterator to retrieve elements from
 * the shared source sequence, starting from the index at the point of obtaining the enumerator.
 */
export declare function publish<TSource>(): OperatorAsyncFunction<TSource, TSource>;
/**
 * Buffer enabling each iterator to retrieve elements from the shared source sequence, starting from the
 * index at the point of obtaining the iterator.
 *
 * @template TSource Source sequence element type.
 * @template TResult Result sequence element type.
 * @param {(value: AsyncIterable<TSource>) => AsyncIterable<TResult>} [selector] Selector function with published
 * access to the source sequence for each iterator.
 * @returns {OperatorAsyncFunction<TSource, TResult>} Sequence resulting from applying the selector function to the
 * published view over the source sequence.
 */
export declare function publish<TSource, TResult>(selector?: (value: AsyncIterable<TSource>) => AsyncIterable<TResult>): OperatorAsyncFunction<TSource, TResult>;
