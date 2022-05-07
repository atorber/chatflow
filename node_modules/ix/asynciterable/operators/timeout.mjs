import { AsyncIterableX } from '../asynciterablex';
import { sleep } from '../_sleep';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
import { isObject } from '../../util/isiterable';
import { safeRace } from '../../util/safeRace';
export class TimeoutError extends Error {
    constructor(message = 'Timeout has occurred') {
        super(message);
        Object.setPrototypeOf(this, TimeoutError.prototype);
        Error.captureStackTrace(this, this.constructor);
        this.name = 'TimeoutError';
    }
    get [Symbol.toStringTag]() {
        return 'TimeoutError';
    }
}
Object.defineProperty(TimeoutError, Symbol.hasInstance, {
    writable: true,
    configurable: true,
    value(x) {
        return (isObject(x) &&
            (x.constructor.name === 'TimeoutError' || x[Symbol.toStringTag] === 'TimeoutError'));
    },
});
const VALUE_TYPE = 'value';
const ERROR_TYPE = 'error';
export class TimeoutAsyncIterable extends AsyncIterableX {
    _source;
    _dueTime;
    constructor(source, dueTime) {
        super();
        this._source = source;
        this._dueTime = dueTime;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const it = wrapWithAbort(this._source, signal)[Symbol.asyncIterator]();
        while (1) {
            const { type, value } = await safeRace([
                it.next().then((val) => {
                    return { type: VALUE_TYPE, value: val };
                }),
                sleep(this._dueTime, signal).then(() => {
                    return { type: ERROR_TYPE };
                }),
            ]);
            if (type === ERROR_TYPE) {
                throw new TimeoutError();
            }
            if (!value || value.done) {
                break;
            }
            yield value.value;
        }
    }
}
/**
 * Applies a timeout policy for each element in the async-iterable sequence.
 * If the next element isn't received within the specified timeout duration starting from its predecessor, a TimeoutError is thrown.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} dueTime Maximum duration in milliseconds between values before a timeout occurs.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The source sequence with a TimeoutError in case of a timeout.
 */
export function timeout(dueTime) {
    return function timeoutOperatorFunction(source) {
        return new TimeoutAsyncIterable(source, dueTime);
    };
}

//# sourceMappingURL=timeout.mjs.map
