import { ReduceOptions } from './reduceoptions';
/**
 * Applies an accumulator function over an iterable sequence, returning the result of the aggregation as a
 * single element in the result sequence. The seed value, if specified, is used as the initial accumulator value.
 * For aggregation behavior with incremental intermediate results, scan.
 *
 * @template T The type of the elements in the source sequence.
 * @template R The type of the result of the aggregation.
 * @param {Iterable<T>} source An iterable sequence to aggregate over.
 * @param {ReduceOptions<T, R>} options The options which contains a callback and optional seed.
 * @returns {R} The final accumulator value.
 */
export declare function reduce<T, R = T>(source: Iterable<T>, options: ReduceOptions<T, R>): R;
export declare function reduce<T, R = T>(source: Iterable<T>, accumulator: (accumulator: R, current: T, index: number) => R, seed?: R): R;
