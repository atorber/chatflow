"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeLast = exports.TakeLastIterable = void 0;
const iterablex_1 = require("../iterablex");
class TakeLastIterable extends iterablex_1.IterableX {
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
exports.TakeLastIterable = TakeLastIterable;
/**
 * Returns a specified number of contiguous elements from the end of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to take from the end of the source sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence containing the specified
 * number of elements from the end of the source sequence.
 */
function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        return new TakeLastIterable(source, count);
    };
}
exports.takeLast = takeLast;

//# sourceMappingURL=takelast.js.map
