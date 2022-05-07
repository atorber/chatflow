import { IterableX } from '../iterablex';
import { arrayIndexOf } from '../../util/arrayindexof';
import { comparer as defaultComparer } from '../../util/comparer';
export class ExceptIterable extends IterableX {
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
            if (arrayIndexOf(map, firstItem, this._comparer) === -1) {
                map.push(firstItem);
                yield firstItem;
            }
        }
    }
}
/**
 *  Produces the set difference of two iterable sequences by using the specified equality comparer to compare values.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {Iterable<TSource>} second An iterable sequence whose elements that also occur in the
 * operator sequence will cause those elements to be removed from the returned sequence.
 * @param {((x: TSource, y: TSource) => boolean} [comparer=defaultComparer] An equality comparer to compare values
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns a sequence that contains the set
 * difference of the elements of two sequences.
 */
export function except(second, comparer = defaultComparer) {
    return function exceptOperatorFunction(first) {
        return new ExceptIterable(first, second, comparer);
    };
}

//# sourceMappingURL=except.mjs.map
