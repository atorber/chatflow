import { IterableX } from '../iterablex';
import { arrayIndexOf } from '../../util/arrayindexof';
import { comparer as defaultComparer } from '../../util/comparer';
export class UnionIterable extends IterableX {
    _left;
    _right;
    _comparer;
    constructor(left, right, comparer) {
        super();
        this._left = left;
        this._right = right;
        this._comparer = comparer;
    }
    *[Symbol.iterator]() {
        const map = [];
        for (const lItem of this._left) {
            if (arrayIndexOf(map, lItem, this._comparer) === -1) {
                map.push(lItem);
                yield lItem;
            }
        }
        for (const rItem of this._right) {
            if (arrayIndexOf(map, rItem, this._comparer) === -1) {
                map.push(rItem);
                yield rItem;
            }
        }
    }
}
/**
 * Produces the set union of two sequences by using the given equality comparer.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {AsyncIterable<TSource>} right An iterable sequence whose distinct elements form the second set for the union.
 * @param {((x: TSource, y: TSource) => boolean)} [comparer=defaultComparer] The equality comparer to compare values.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the elements from both input sequences,
 * excluding duplicates.
 */
export function union(right, comparer = defaultComparer) {
    return function unionOperatorFunction(left) {
        return new UnionIterable(left, right, comparer);
    };
}

//# sourceMappingURL=union.mjs.map
