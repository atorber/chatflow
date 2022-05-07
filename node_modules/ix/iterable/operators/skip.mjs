import { IterableX } from '../iterablex';
export class SkipIterable extends IterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    *[Symbol.iterator]() {
        const it = this._source[Symbol.iterator]();
        let count = this._count;
        let next;
        while (count > 0 && !(next = it.next()).done) {
            count--;
        }
        if (count <= 0) {
            while (!(next = it.next()).done) {
                yield next.value;
            }
        }
    }
}
/**
 * Bypasses a specified number of elements in an iterable sequence and then returns the remaining elements.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to skip before returning the remaining elements.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the elements that
 * occur after the specified index in the input sequence.
 */
export function skip(count) {
    return function skipOperatorFunction(source) {
        return new SkipIterable(source, count);
    };
}

//# sourceMappingURL=skip.mjs.map
