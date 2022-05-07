import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
class RangeAsyncIterable extends AsyncIterableX {
    _start;
    _count;
    constructor(start, count) {
        super();
        this._start = start;
        this._count = count;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for (let current = this._start, end = this._start + this._count; current < end; current++) {
            yield current;
        }
    }
}
/**
 * Generates an async-iterable sequence of integral numbers within a specified range.
 *
 * @param {number} start The value of the first integer in the sequence.
 * @param {number} count The number of sequential integers to generate.
 * @returns {AsyncIterableX<number>} An async-iterable sequence that contains a range of sequential integral numbers.
 */
export function range(start, count) {
    return new RangeAsyncIterable(start, count);
}

//# sourceMappingURL=range.mjs.map
