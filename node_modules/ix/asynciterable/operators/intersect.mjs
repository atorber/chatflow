import { AsyncIterableX } from '../asynciterablex';
import { arrayIndexOfAsync } from '../../util/arrayindexof';
import { comparerAsync } from '../../util/comparer';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
async function arrayRemove(array, item, comparer, signal) {
    throwIfAborted(signal);
    const idx = await arrayIndexOfAsync(array, item, comparer);
    if (idx === -1) {
        return false;
    }
    array.splice(idx, 1);
    return true;
}
export class IntersectAsyncIterable extends AsyncIterableX {
    _first;
    _second;
    _comparer;
    constructor(first, second, comparer) {
        super();
        this._first = first;
        this._second = second;
        this._comparer = comparer;
    }
    async *[Symbol.asyncIterator](signal) {
        const map = [];
        for await (const secondItem of wrapWithAbort(this._second, signal)) {
            map.push(secondItem);
        }
        for await (const firstItem of wrapWithAbort(this._first, signal)) {
            if (await arrayRemove(map, firstItem, this._comparer, signal)) {
                yield firstItem;
            }
        }
    }
}
/**
 * Produces the set intersection of two async-iterable sequences.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {AsyncIterable<TSource>} second An async-iterable sequence whose distinct elements that also
 * appear in the first sequence will be returned.
 * @param {((x: TSource, y: TSource) => boolean | Promise<boolean>)} [comparer=comparerAsync] An equality comparer to compare values.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that returns a sequence that contains the elements that form the set
 * intersection of two sequences.
 */
export function intersect(second, comparer = comparerAsync) {
    return function intersectOperatorFunction(first) {
        return new IntersectAsyncIterable(first, second, comparer);
    };
}

//# sourceMappingURL=intersect.mjs.map
