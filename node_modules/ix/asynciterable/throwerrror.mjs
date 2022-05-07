import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
class ThrowAsyncIterable extends AsyncIterableX {
    _error;
    constructor(error) {
        super();
        this._error = error;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        throw this._error;
    }
}
/**
 * Creates an async-iterable that throws the specified error upon iterating.
 *
 * @param {*} error The error to throw upon iterating the async-iterable.
 * @returns {AsyncIterableX<never>} An async-iterable that throws when iterated.
 */
export function throwError(error) {
    return new ThrowAsyncIterable(error);
}

//# sourceMappingURL=throwerrror.mjs.map
