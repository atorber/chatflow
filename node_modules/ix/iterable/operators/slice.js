"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slice = exports.SliceIterable = void 0;
const iterablex_1 = require("../iterablex");
class SliceIterable extends iterablex_1.IterableX {
    _source;
    _begin;
    _end;
    constructor(source, begin, end) {
        super();
        this._source = source;
        this._begin = begin;
        this._end = end;
    }
    *[Symbol.iterator]() {
        const it = this._source[Symbol.iterator]();
        let begin = this._begin;
        let next;
        while (begin > 0 && !(next = it.next()).done) {
            begin--;
        }
        let end = this._end;
        if (end > 0) {
            while (!(next = it.next()).done) {
                yield next.value;
                if (--end === 0) {
                    break;
                }
            }
        }
    }
}
exports.SliceIterable = SliceIterable;
/**
 * Returns the elements from the source iterable sequence only after the function that returns a promise produces an element.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} begin Zero-based index at which to begin extraction.
 * @param {number} [end=Infinity] Zero-based index before which to end extraction.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable containing the extracted elements.
 */
function slice(begin, end = Infinity) {
    return function sliceOperatorFunction(source) {
        return new SliceIterable(source, begin, end);
    };
}
exports.slice = slice;

//# sourceMappingURL=slice.js.map
