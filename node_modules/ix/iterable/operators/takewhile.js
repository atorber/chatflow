"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeWhile = exports.TakeWhileIterable = void 0;
const iterablex_1 = require("../iterablex");
class TakeWhileIterable extends iterablex_1.IterableX {
    _source;
    _predicate;
    constructor(source, predicate) {
        super();
        this._source = source;
        this._predicate = predicate;
    }
    *[Symbol.iterator]() {
        let i = 0;
        for (const item of this._source) {
            if (!this._predicate(item, i++)) {
                break;
            }
            yield item;
        }
    }
}
exports.TakeWhileIterable = TakeWhileIterable;
/**
 * Returns elements from an iterable sequence as long as a specified condition is true.
 *
 * @template T The type of the elements in the source sequence.
 * @param {((value: T, index: number) => boolean)} predicate A function to test each element for a condition.
 * @returns {OperatorFunction<T, T>} An iterable sequence that contains the elements from the input sequence that occur
 * before the element at which the test no longer passes.
 */
function takeWhile(predicate) {
    return function takeWhileOperatorFunction(source) {
        return new TakeWhileIterable(source, predicate);
    };
}
exports.takeWhile = takeWhile;

//# sourceMappingURL=takewhile.js.map
