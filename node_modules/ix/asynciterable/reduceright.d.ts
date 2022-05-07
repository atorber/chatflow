import { ReduceOptions } from './reduceoptions';
/**
 * Applies an accumulator function over an async-iterable sequence from the end, returning the result of the aggregation as a
 * single element in the result sequence. The seed value, if specified, is used as the initial accumulator value.
 * For aggregation behavior with incremental intermediate results, scan.
 *
 * @template T The type of the elements in the source sequence.
 * @template R The type of the result of the aggregation.
 * @param {AsyncIterable<T>} source An async-iterable sequence to aggregate over from the right.
 * @param {ReduceOptions<T, R>} options The options which contains a callback, with optional seed and an optional abort signal for cancellation.
 * @returns {Promise<R>} A promise with the final accumulator value.
 */
export declare function reduceRight<T, R = T>(source: AsyncIterable<T>, options: ReduceOptions<T, R>): Promise<R>;
