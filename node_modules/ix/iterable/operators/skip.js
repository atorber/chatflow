"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skip = exports.SkipIterable = void 0;
const iterablex_1 = require("../iterablex");
class SkipIterable extends iterablex_1.IterableX {
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
exports.SkipIterable = SkipIterable;
/**
 * Bypasses a specified number of elements in an iterable sequence and then returns the remaining elements.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to skip before returning the remaining elements.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the elements that
 * occur after the specified index in the input sequence.
 */
function skip(count) {
    return function skipOperatorFunction(source) {
        return new SkipIterable(source, count);
    };
}
exports.skip = skip;

//# sourceMappingURL=skip.js.map
