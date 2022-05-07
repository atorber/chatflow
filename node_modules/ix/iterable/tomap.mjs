import { identity } from '../util/identity';
/**
 * Converts an async-iterable to a map with a key selector and options for an element selector and cancellation.
 *
 * @template TSource The type of elements in the source collection.
 * @template TKey The type of key used for the map.
 * @template TElement The type of element to use for the map.
 * @param {AsyncIterable<TSource>} source The source collection to turn into a map.
 * @param {ToMapOptions<TSource, TElement>} options The options for getting the key and element for the map.
 * @returns {(Map<TKey, TElement | TSource>)} A map containing the key and elements from the selector functions.
 */
export function toMap(source, options) {
    const { ['elementSelector']: elementSelector = identity, ['keySelector']: keySelector = identity, } = options || {};
    const map = new Map();
    for (const item of source) {
        const value = elementSelector(item);
        const key = keySelector(item);
        map.set(key, value);
    }
    return map;
}

//# sourceMappingURL=tomap.mjs.map
