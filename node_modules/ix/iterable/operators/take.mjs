import { IterableX } from '../iterablex';
export class TakeIterable extends IterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    *[Symbol.iterator]() {
        let i = this._count;
        if (i > 0) {
            for (const item of this._source) {
                yield item;
                if (--i === 0) {
                    break;
                }
            }
        }
    }
}
/**
 * Returns a specified number of contiguous elements from the start of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to return.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the specified
 * number of elements from the start of the input sequence.
 */
export function take(count) {
    return function takeOperatorFunction(source) {
        return new TakeIterable(source, count);
    };
}

//# sourceMappingURL=take.mjs.map
