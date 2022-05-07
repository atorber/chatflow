import { AsyncIterableX } from '../asynciterablex';
import { sleep } from '../_sleep';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class DelayEachAsyncIterable extends AsyncIterableX {
    _source;
    _dueTime;
    constructor(source, dueTime) {
        super();
        this._source = source;
        this._dueTime = dueTime;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for await (const item of wrapWithAbort(this._source, signal)) {
            await sleep(this._dueTime, signal);
            yield item;
        }
    }
}
/**
 * Delays the emitting of each items in the async-iterable by the given due time.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} dueTime The delay duration in milliseconds
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator which takes an async-iterable and delays each item in the sequence by the given time.
 */
export function delayEach(dueTime) {
    return function delayEachOperatorFunction(source) {
        return new DelayEachAsyncIterable(source, dueTime);
    };
}

//# sourceMappingURL=delayeach.mjs.map
