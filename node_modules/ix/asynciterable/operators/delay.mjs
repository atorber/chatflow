import { AsyncIterableX } from '../asynciterablex';
import { sleep } from '../_sleep';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class DelayAsyncIterable extends AsyncIterableX {
    _source;
    _dueTime;
    constructor(source, dueTime) {
        super();
        this._source = source;
        this._dueTime = dueTime;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        await sleep(this._dueTime, signal);
        for await (const item of wrapWithAbort(this._source, signal)) {
            yield item;
        }
    }
}
/**
 * Delays the emitting of the first item in the async-iterable by the given due time.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} dueTime The delay duration in milliseconds
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator which delays the before the iteration begins.
 */
export function delay(dueTime) {
    return function delayOperatorFunction(source) {
        return new DelayAsyncIterable(source, dueTime);
    };
}

//# sourceMappingURL=delay.mjs.map
