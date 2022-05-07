import { IterableX } from './iterablex';
class RangeIterable extends IterableX {
    _start;
    _count;
    constructor(start, count) {
        super();
        this._start = start;
        this._count = count;
    }
    *[Symbol.iterator]() {
        for (let current = this._start, end = this._start + this._count; current < end; current++) {
            yield current;
        }
    }
}
/**
 * Generates an iterable sequence of integral numbers within a specified range.
 *
 * @param {number} start The value of the first integer in the sequence.
 * @param {number} count The number of sequential integers to generate.
 * @returns {IterableX<number>} An iterable sequence that contains a range of sequential integral numbers.
 */
export function range(start, count) {
    return new RangeIterable(start, count);
}

//# sourceMappingURL=range.mjs.map
