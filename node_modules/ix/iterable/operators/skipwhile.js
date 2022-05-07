"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipWhile = exports.SkipWhileIterable = void 0;
const iterablex_1 = require("../iterablex");
class SkipWhileIterable extends iterablex_1.IterableX {
    _source;
    _predicate;
    constructor(source, predicate) {
        super();
        this._source = source;
        this._predicate = predicate;
    }
    *[Symbol.iterator]() {
        let yielding = false;
        let i = 0;
        for (const element of this._source) {
            if (!yielding && !this._predicate(element, i++)) {
                yielding = true;
            }
            if (yielding) {
                yield element;
            }
        }
    }
}
exports.SkipWhileIterable = SkipWhileIterable;
/**
 * Bypasses elements in an async-iterale sequence as long as a specified condition is true
 * and then returns the remaining elements.
 *
 * @template T The type of the elements in the source sequence.
 * @param {((value: T, index: number) => boolean)} predicate A function to test each element for a condition.
 * @returns {OperatorFunction<T, T>} An iterable sequence that contains the elements from the input
 * sequence starting at the first element in the linear series that does not pass the test specified by predicate.
 */
function skipWhile(predicate) {
    return function skipWhileOperatorFunction(source) {
        return new SkipWhileIterable(source, predicate);
    };
}
exports.skipWhile = skipWhile;

//# sourceMappingURL=skipwhile.js.map
