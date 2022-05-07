import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class TimestampAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for await (const item of wrapWithAbort(this._source, signal)) {
            yield { time: Date.now(), value: item };
        }
    }
}
/**
 * Timestamps each element in an async-iterable sequence using the local system clock.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {OperatorAsyncFunction<TSource, Timestamp<TSource>>} An async-iterable sequence with timestamp information on elements.
 */
export function timestamp() {
    return function timestampOperatorFunction(source) {
        return new TimestampAsyncIterable(source);
    };
}

//# sourceMappingURL=timestamp.mjs.map
