import { ExtremaOptions } from './extremaoptions';
/**
 * Returns the maximum element with the optional selector.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {Iterable<TSource>} source An async-iterable sequence to determine the maximum element of.
 * @param {ExtremaByOptions<TKey>} [options] The options which include an optional comparer and abort signal.
 * @returns {Promise<TResult>} The maximum element.
 */
export declare function max<TSource, TResult = TSource>(source: Iterable<TSource>, options?: ExtremaOptions<TSource, TResult>): TResult;
