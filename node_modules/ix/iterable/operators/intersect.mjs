import { IterableX } from '../iterablex';
import { arrayIndexOf } from '../../util/arrayindexof';
import { comparer as defaultComparer } from '../../util/comparer';
function arrayRemove(array, item, comparer) {
    const idx = arrayIndexOf(array, item, comparer);
    if (idx === -1) {
        return false;
    }
    array.splice(idx, 1);
    return true;
}
export class IntersectIterable extends IterableX {
    _first;
    _second;
    _comparer;
    constructor(first, second, comparer) {
        super();
        this._first = first;
        this._second = second;
        this._comparer = comparer;
    }
    *[Symbol.iterator]() {
        const map = [];
        for (const secondItem of this._second) {
            map.push(secondItem);
        }
        for (const firstItem of this._first) {
            if (arrayRemove(map, firstItem, this._comparer)) {
                yield firstItem;
            }
        }
    }
}
/**
 * Produces the set intersection of two iterable sequences.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {Iterable<TSource>} second An iterable sequence whose distinct elements that also
 * appear in the first sequence will be returned.
 * @param {((x: TSource, y: TSource) => boolean)} [comparer=defaultComparer] An equality comparer to compare values.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns a sequence that contains the elements that form the set
 * intersection of two sequences.
 */
export function intersect(second, comparer = defaultComparer) {
    return function intersectOperatorFunction(first) {
        return new IntersectIterable(first, second, comparer);
    };
}

//# sourceMappingURL=intersect.mjs.map
