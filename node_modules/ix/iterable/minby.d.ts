import { ExtremaOptions } from './extremaoptions';
/**
 * Returns the elements in an terable sequence with the minimum key value.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the key computed for each element in the source sequence.
 * @param {Iterable<TSource>} source An async-iterable sequence to get the minimum elements for.
 * @param {ExtremaOptions<TSource, TKey>} [options] The options which include an optional comparer.
 * @returns {TSource[]} A list of zero or more elements that have a minimum key value.
 */
export declare function minBy<TSource, TKey>(source: Iterable<TSource>, options?: ExtremaOptions<TSource, TKey>): TSource[];
