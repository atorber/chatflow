import { ExtremaOptions } from './extremaoptions';
/**
 *  * Returns the minimum element with the optional selector.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AsyncIterable<TSource>} source An async-iterable sequence to determine the minimum element of.
 * @param {ExtremaOptions<TSource, TKey>} [options] The options which include an optional comparer and abort signal.
 * @returns {Promise<TSource>} A promise containing the minimum element.
 */
export declare function min<TSource, TResult = TSource>(source: AsyncIterable<TSource>, options?: ExtremaOptions<TSource, TResult>): Promise<TResult>;
