"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = exports.ReverseIterable = void 0;
const iterablex_1 = require("../iterablex");
class ReverseIterable extends iterablex_1.IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        const results = [];
        for (const item of this._source) {
            results.unshift(item);
        }
        yield* results;
    }
}
exports.ReverseIterable = ReverseIterable;
/**
 * Reverses the iterable instance.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The iterable in reversed sequence.
 */
function reverse() {
    return function reverseOperatorFunction(source) {
        return new ReverseIterable(source);
    };
}
exports.reverse = reverse;

//# sourceMappingURL=reverse.js.map
