import { IterableX } from './iterablex';
class ThrowIterable extends IterableX {
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
export function throwError(error) {
    return new ThrowIterable(error);
}

//# sourceMappingURL=throwerror.mjs.map
