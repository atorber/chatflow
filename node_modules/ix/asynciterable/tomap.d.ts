/**
 * The options for the toMap method which include an optional element selector and abort signal for cancellation.
 *
 * @interface ToMapOptions
 * @template TSource
 * @template TElement
 */
export interface ToMapOptions<TSource, TElement> {
    /**
     * The selector to get the key for the map.
     *
     * @memberof ToMapOptions
     */
    keySelector: (item: TSource, signal?: AbortSignal) => TElement | Promise<TElement>;
    /**
     * The selector used to get the element for the Map.
     *
     * @memberof ToMapOptions
     */
    elementSelector?: (item: TSource, signal?: AbortSignal) => TElement | Promise<TElement>;
    /**
     * An optional abort signal to cancel the operation at any time.
     *
     * @type {AbortSignal}
     * @memberof ToMapOptions
     */
    signal?: AbortSignal;
}
/**
 * Converts an async-iterable to a map with a key selector and options for an element selector and cancellation.
 *
 * @template TSource The type of elements in the source collection.
 * @template TKey The type of key used for the map.
 * @template TElement The type of element to use for the map.
 * @param {AsyncIterable<TSource>} source The source collection to turn into a map.
 * @param {ToMapOptions<TSource, TElement>} [options]
 * @returns {(Promise<Map<TKey, TElement | TSource>>)}
 */
export declare function toMap<TSource, TKey, TElement = TSource>(source: AsyncIterable<TSource>, options: ToMapOptions<TSource, TElement>): Promise<Map<TKey, TElement | TSource>>;
