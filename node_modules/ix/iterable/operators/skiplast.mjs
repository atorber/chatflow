import { IterableX } from '../iterablex';
export class SkipLastIterable extends IterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    *[Symbol.iterator]() {
        const q = [];
        for (const item of this._source) {
            q.push(item);
            if (q.length > this._count) {
                yield q.shift();
            }
        }
    }
}
/**
 * Bypasses a specified number of elements at the end of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to bypass at the end of the source sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence containing the
 * source sequence elements except for the bypassed ones at the end.
 */
export function skipLast(count) {
    return function skipLastOperatorFunction(source) {
        return new SkipLastIterable(source, count);
    };
}

//# sourceMappingURL=skiplast.mjs.map
