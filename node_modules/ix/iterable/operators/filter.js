"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = exports.FilterIterable = void 0;
const iterablex_1 = require("../iterablex");
class FilterIterable extends iterablex_1.IterableX {
    _source;
    _predicate;
    _thisArg;
    constructor(source, predicate, thisArg) {
        super();
        this._source = source;
        this._predicate = predicate;
        this._thisArg = thisArg;
    }
    *[Symbol.iterator]() {
        let i = 0;
        for (const item of this._source) {
            if (this._predicate.call(this._thisArg, item, i++)) {
                yield item;
            }
        }
    }
}
exports.FilterIterable = FilterIterable;
/**
 * Filters the elements of an iterable sequence based on a predicate.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {((value: TSource, index: number) => boolean)} predicate A function to test each source element for a condition.
 * @param {*} [thisArg] Optional this for binding.
 * @returns {OperatorFunction<TSource, TSource>} An operator which returns an iterable
 * sequence that contains elements from the input sequence that satisfy the condition.
 */
function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return new FilterIterable(source, predicate, thisArg);
    };
}
exports.filter = filter;

//# sourceMappingURL=filter.js.map
