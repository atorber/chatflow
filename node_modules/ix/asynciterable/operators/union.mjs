import { AsyncIterableX } from '../asynciterablex';
import { arrayIndexOfAsync } from '../../util/arrayindexof';
import { comparerAsync } from '../../util/comparer';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class UnionAsyncIterable extends AsyncIterableX {
    _left;
    _right;
    _comparer;
    constructor(left, right, comparer) {
        super();
        this._left = left;
        this._right = right;
        this._comparer = comparer;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const map = [];
        for await (const lItem of wrapWithAbort(this._left, signal)) {
            if ((await arrayIndexOfAsync(map, lItem, this._comparer)) === -1) {
                map.push(lItem);
                yield lItem;
            }
        }
        for await (const rItem of wrapWithAbort(this._right, signal)) {
            if ((await arrayIndexOfAsync(map, rItem, this._comparer)) === -1) {
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
 * @param {AsyncIterable<TSource>} right An async-iterable sequence whose distinct elements form the second set for the union.
 * @param {((x: TSource, y: TSource) => boolean | Promise<boolean>)} [comparer=comparerAsync] The equality comparer to compare values.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable sequence that contains the elements from both input sequences,
 * excluding duplicates.
 */
export function union(right, comparer = comparerAsync) {
    return function unionOperatorFunction(left) {
        return new UnionAsyncIterable(left, right, comparer);
    };
}

//# sourceMappingURL=union.mjs.map
