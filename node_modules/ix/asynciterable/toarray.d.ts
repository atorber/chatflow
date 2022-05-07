/**
 * Converts an existing async-iterable to a promise containing the array of values.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The source sequence to convert to an array.
 * @param {AbortSignal} [signal] An optional abort signal to cancel the operation at any time.
 * @returns {Promise<TSource[]>} A promise containing all the items from the source sequence as an array.
 */
export declare function toArray<TSource>(source: AsyncIterable<TSource>, signal?: AbortSignal): Promise<TSource[]>;
