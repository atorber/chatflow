import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
export class RepeatValueAsyncIterable extends AsyncIterableX {
    _value;
    _count;
    constructor(value, count) {
        super();
        this._value = value;
        this._count = count;
    }
    async *[Symbol.asyncIterator](signal) {
        if (this._count === -1) {
            while (1) {
                throwIfAborted(signal);
                yield this._value;
            }
        }
        else {
            for (let i = 0; i < this._count; i++) {
                throwIfAborted(signal);
                yield this._value;
            }
        }
    }
}
/**
 * Repeats a given value for the specified number of times as an async-iterable.
 *
 * @template TSource The type of element to repeat.
 * @param {TSource} value The value to repeat as an async-iterable.
 * @param {number} [count=-1] The number of times to repeat the value, infinite if not specified.
 * @returns {AsyncIterableX<TSource>} An async-iterable with a single item that is repeated over the specified times.
 */
export function repeatValue(value, count = -1) {
    return new RepeatValueAsyncIterable(value, count);
}

//# sourceMappingURL=repeatvalue.mjs.map
