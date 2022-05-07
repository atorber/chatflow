import { ExtremaOptions } from './extremaoptions';
/**
 *  * Returns the minimum element with the optional selector.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {Iterable<TSource>} source An iterable sequence to determine the minimum element of.
 * @param {ExtremaByOptions<TKey>} [options] The options which include an optional comparer.
 * @returns {TResult} The minimum element.
 */
export declare function min<TSource, TResult = TSource>(source: Iterable<TSource>, options?: ExtremaOptions<TSource, TResult>): TResult;
