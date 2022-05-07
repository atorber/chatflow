"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
const iterablex_1 = require("./iterablex");
class ThrowIterable extends iterablex_1.IterableX {
    _error;
    constructor(error) {
        super();
        this._error = error;
    }
    *[Symbol.iterator]() {
        throw this._error;
    }
}
/**
 * Creates an async-iterable that throws the specified error upon iterating.
 *
 * @param {*} error The error to throw upon iterating the iterable.
 * @returns {AsyncIterableX<never>} An iterable that throws when iterated.
 */
function throwError(error) {
    return new ThrowIterable(error);
}
exports.throwError = throwError;

//# sourceMappingURL=throwerror.js.map
