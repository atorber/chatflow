/**
 * Converts the existing async-iterable into a promise which resolves a Set.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The async-iterable to convert into a set.
 * @param {AbortSignal} [signal] An optional abort signal to cancel the operation at any time.
 * @returns {Promise<Set<TSource>>} A promise which contains a Set with all the elements from the async-iterable.
 */
export declare function toSet<TSource>(source: AsyncIterable<TSource>, signal?: AbortSignal): Promise<Set<TSource>>;
