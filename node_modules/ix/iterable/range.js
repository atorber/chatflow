"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
const iterablex_1 = require("./iterablex");
class RangeIterable extends iterablex_1.IterableX {
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
function range(start, count) {
    return new RangeIterable(start, count);
}
exports.range = range;

//# sourceMappingURL=range.js.map
