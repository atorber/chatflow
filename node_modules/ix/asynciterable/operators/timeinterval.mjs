import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class TimeIntervalAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let last = Date.now();
        for await (const item of wrapWithAbort(this._source, signal)) {
            const now = Date.now();
            const span = now - last;
            last = now;
            yield { value: item, elapsed: span };
        }
    }
}
/**
 * Records the time interval between consecutive elements in an async-iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {OperatorAsyncFunction<TSource, TimeInterval<TSource>>} An async-iterable sequence with time
 * interval information on elements.
 */
export function timeInterval() {
    return function timeIntervalOperatorFunction(source) {
        return new TimeIntervalAsyncIterable(source);
    };
}

//# sourceMappingURL=timeinterval.mjs.map
