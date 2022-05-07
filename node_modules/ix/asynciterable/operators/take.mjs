import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class TakeAsyncIterable extends AsyncIterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let i = this._count;
        if (i > 0) {
            for await (const item of wrapWithAbort(this._source, signal)) {
                yield item;
                if (--i === 0) {
                    break;
                }
            }
        }
    }
}
/**
 * Returns a specified number of contiguous elements from the start of an async-iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to return.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable sequence that contains the specified
 * number of elements from the start of the input sequence.
 */
export function take(count) {
    return function takeOperatorFunction(source) {
        return new TakeAsyncIterable(source, count);
    };
}

//# sourceMappingURL=take.mjs.map
