import { IterableX } from '../iterablex';
export class TakeLastIterable extends IterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    *[Symbol.iterator]() {
        if (this._count > 0) {
            const q = [];
            for (const item of this._source) {
                if (q.length >= this._count) {
                    q.shift();
                }
                q.push(item);
            }
            while (q.length > 0) {
                yield q.shift();
            }
        }
    }
}
/**
 * Returns a specified number of contiguous elements from the end of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to take from the end of the source sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence containing the specified
 * number of elements from the end of the source sequence.
 */
export function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        return new TakeLastIterable(source, count);
    };
}

//# sourceMappingURL=takelast.mjs.map
