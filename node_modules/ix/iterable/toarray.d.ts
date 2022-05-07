/**
 * Converts an existing iterable to anarray of values.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {Iterable<TSource>} source The source sequence to convert to an array.
 * @returns {TSource[]} All the items from the source sequence as an array.
 */
export declare function toArray<TSource>(source: Iterable<TSource>): TSource[];
