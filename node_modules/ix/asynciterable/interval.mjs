import { AsyncIterableX } from './asynciterablex';
import { sleep } from './_sleep';
import { throwIfAborted } from '../aborterror';
class IntervalAsyncIterable extends AsyncIterableX {
    _dueTime;
    constructor(dueTime) {
        super();
        this._dueTime = dueTime;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let i = 0;
        while (1) {
            await sleep(this._dueTime, signal);
            yield i++;
        }
    }
}
/**
 * Produces a new item in an async-iterable at the given interval cycle time.
 *
 * @param {number} dueTime The due time in milliseconds to spawn a new item.
 * @returns {AsyncIterableX<number>} An async-iterable producing values at the specified interval.
 */
export function interval(dueTime) {
    return new IntervalAsyncIterable(dueTime);
}

//# sourceMappingURL=interval.mjs.map
