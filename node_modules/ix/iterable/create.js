"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const iterablex_1 = require("./iterablex");
class AnonymousIterable extends iterablex_1.IterableX {
    _fn;
    constructor(fn) {
        super();
        this._fn = fn;
    }
    [Symbol.iterator]() {
        return this._fn();
    }
}
/**
 * Creates a new iterable using the specified function implementing the members of AsyncIterable
 *
 * @template T The type of the elements returned by the iterable sequence.
 * @param {(() => Iterator<T>)} fn The function that creates the [Symbol.iterator]() method
 * @returns {IterableX<T>} A new iterable instance.
 */
function create(getIterator) {
    return new AnonymousIterable(getIterator);
}
exports.create = create;

//# sourceMappingURL=create.js.map
