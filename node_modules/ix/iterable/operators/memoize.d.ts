import { OperatorFunction } from '../../interfaces';
/**
 * Creates a buffer with a view over the source sequence, causing a specified number of iterators to obtain access
 * to all of the sequence's elements without causing multiple enumerations over the source.
 * @template TSource Source sequence element type.
 * @param {number} [readerCount] Number of iterators that can access the underlying buffer.
 * Once every iterator has obtained an element from the buffer, the element is removed from the buffer.
 * @returns {OperatorFunction<TSource, TSource>} Buffer enabling a specified number of iterators to retrieve all
 * elements from the shared source sequence, without duplicating source iteration side-effects.
 */
export declare function memoize<TSource>(readerCount?: number): OperatorFunction<TSource, TSource>;
/**
 * Memoizes the source sequence within a selector function where a specified number of iterators can get access
 * to all of the sequence's elements without causing multiple iterations over the source.
 *
 * @template TSource Source sequence element type.
 * @template TResult Result sequence element type.
 * @param {number} [readerCount] Number of iterators that can access the underlying buffer. Once every
 * iterator has obtained an element from the buffer, the element is removed from the buffer.
 * @param {(value: Iterable<TSource>) => Iterable<TResult>} [selector] Selector function with memoized access
 * to the source sequence for a specified number of iterators.
 * @returns {OperatorFunction<TSource, TResult>} Sequence resulting from applying the selector function to the
 * memoized view over the source sequence.
 */
export declare function memoize<TSource, TResult>(readerCount?: number, selector?: (value: Iterable<TSource>) => Iterable<TResult>): OperatorFunction<TSource, TResult>;
