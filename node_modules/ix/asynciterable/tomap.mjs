import { identityAsync } from '../util/identity';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
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
export async function toMap(source, options) {
    const { ['signal']: signal, ['elementSelector']: elementSelector = identityAsync, ['keySelector']: keySelector = identityAsync, } = options || {};
    throwIfAborted(signal);
    const map = new Map();
    for await (const item of wrapWithAbort(source, signal)) {
        const value = await elementSelector(item, signal);
        const key = await keySelector(item, signal);
        map.set(key, value);
    }
    return map;
}

//# sourceMappingURL=tomap.mjs.map
