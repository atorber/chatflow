import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class TakeLastAsyncIterable extends AsyncIterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        if (this._count > 0) {
            const q = [];
            for await (const item of wrapWithAbort(this._source, signal)) {
                if (q.length >= this._count) {
                    q.shift();
                }
                q.push(item);
            }
            while (q.length > 0) {
                yield q.shift();
            }
        }
    }
}
/**
 * Returns a specified number of contiguous elements from the end of an async-iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to take from the end of the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable sequence containing the specified
 * number of elements from the end of the source sequence.
 */
export function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        return new TakeLastAsyncIterable(source, count);
    };
}

//# sourceMappingURL=takelast.mjs.map
