import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class ThrottleAsyncIterable extends AsyncIterableX {
    _source;
    _time;
    constructor(source, time) {
        super();
        this._source = source;
        this._time = time;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let currentTime;
        let previousTime;
        for await (const item of wrapWithAbort(this._source, signal)) {
            currentTime = Date.now();
            if (!previousTime || currentTime - previousTime > this._time) {
                previousTime = currentTime;
                yield item;
            }
        }
    }
}
/**
 * Throttles the source async-iterable sequence so that it doesn't emit more than one value during the given timeframe.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} time The time in milliseconds to throttle the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The source sequence throttled by the given timeframe.
 */
export function throttle(time) {
    return function throttleOperatorFunction(source) {
        return new ThrottleAsyncIterable(source, time);
    };
}

//# sourceMappingURL=throttle.mjs.map
