"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfIterable = exports.of = void 0;
const iterablex_1 = require("./iterablex");
/**
 * Creates an iterable from the specified elements.
 *
 * @template TSource The type of the elements to create an iterable sequence.
 * @param {...TSource[]} args The elements to turn into an iterable sequence.
 * @returns {IterableX<TSource>} The iterable sequence created from the elements.
 */
function of(...args) {
    return new OfIterable(args);
}
exports.of = of;
class OfIterable extends iterablex_1.IterableX {
    _args;
    constructor(args) {
        super();
        this._args = args;
    }
    *[Symbol.iterator]() {
        yield* this._args;
    }
}
exports.OfIterable = OfIterable;

//# sourceMappingURL=of.js.map
