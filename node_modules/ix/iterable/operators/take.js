"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.take = exports.TakeIterable = void 0;
const iterablex_1 = require("../iterablex");
class TakeIterable extends iterablex_1.IterableX {
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
exports.TakeIterable = TakeIterable;
/**
 * Returns a specified number of contiguous elements from the start of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to return.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the specified
 * number of elements from the start of the input sequence.
 */
function take(count) {
    return function takeOperatorFunction(source) {
        return new TakeIterable(source, count);
    };
}
exports.take = take;

//# sourceMappingURL=take.js.map
