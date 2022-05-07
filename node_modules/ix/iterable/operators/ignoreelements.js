"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreElements = exports.IgnoreElementsIterable = void 0;
const iterablex_1 = require("../iterablex");
class IgnoreElementsIterable extends iterablex_1.IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        const it = this._source[Symbol.iterator]();
        while (!it.next().done) {
            /* intentionally empty */
        }
    }
}
exports.IgnoreElementsIterable = IgnoreElementsIterable;
/**
 * Ignores all elements in an iterable sequence leaving only the termination messages.
 *
 * @template TSource The type of the elements in the source sequence
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns an empty iterable sequence
 * that signals termination, successful or exceptional, of the source sequence.
 */
function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return new IgnoreElementsIterable(source);
    };
}
exports.ignoreElements = ignoreElements;

//# sourceMappingURL=ignoreelements.js.map
