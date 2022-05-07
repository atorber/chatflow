"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMap = exports.FlatMapIterable = void 0;
const iterablex_1 = require("../iterablex");
class FlatMapIterable extends iterablex_1.IterableX {
    _source;
    _fn;
    _thisArg;
    constructor(source, fn, thisArg) {
        super();
        this._source = source;
        this._fn = fn;
        this._thisArg = thisArg;
    }
    *[Symbol.iterator]() {
        let index = 0;
        for (const outerItem of this._source) {
            for (const innerItem of this._fn.call(this._thisArg, outerItem, index++)) {
                yield innerItem;
            }
        }
    }
}
exports.FlatMapIterable = FlatMapIterable;
/**
 * Projects each element of an iterable sequence to an iterable sequence and merges
 * the resulting iterable sequences into one iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the projected inner sequences and the elements in the merged result sequence.
 * @param {((value: TSource, index: number) => Iterable<TResult>)} selector A transform function to apply to each element.
 * @param {*} [thisArg] Option this for binding to the selector.
 * @returns {OperatorFunction<TSource, TResult>} An operator that creates an iterable sequence whose
 * elements are the result of invoking the one-to-many transform function on each element of the input sequence.
 */
function flatMap(selector, thisArg) {
    return function flatMapOperatorFunction(source) {
        return new FlatMapIterable(source, selector, thisArg);
    };
}
exports.flatMap = flatMap;

//# sourceMappingURL=flatmap.js.map
