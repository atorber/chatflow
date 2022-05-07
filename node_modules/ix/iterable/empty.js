"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = void 0;
const iterablex_1 = require("./iterablex");
class EmptyIterable extends iterablex_1.IterableX {
    *[Symbol.iterator]() {
        // eslint-disable-next-line no-empty
    }
}
/**
 * Returns an empty iterable sequence.
 *
 * @template TSource The type used for the iterable type parameter of the resulting sequence.
 * @returns {IterableX<never>} An iterable sequence with no elements.
 */
function empty() {
    return new EmptyIterable();
}
exports.empty = empty;

//# sourceMappingURL=empty.js.map
