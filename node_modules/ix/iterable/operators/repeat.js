"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat = exports.RepeatIterable = void 0;
const iterablex_1 = require("../iterablex");
class RepeatIterable extends iterablex_1.IterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    *[Symbol.iterator]() {
        if (this._count === -1) {
            while (1) {
                for (const item of this._source) {
                    yield item;
                }
            }
        }
        else {
            for (let i = 0; i < this._count; i++) {
                for (const item of this._source) {
                    yield item;
                }
            }
        }
    }
}
exports.RepeatIterable = RepeatIterable;
/**
 * Repeats the async-enumerable sequence a specified number of times.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} [count=-1] Number of times to repeat the sequence. If not specified, the sequence repeats indefinitely.
 * @returns {MonoTypeOperatorFunction<TSource>} The iterable sequence producing the elements of the given sequence repeatedly.
 */
function repeat(count = -1) {
    return function repeatOperatorFunction(source) {
        return new RepeatIterable(source, count);
    };
}
exports.repeat = repeat;

//# sourceMappingURL=repeat.js.map
