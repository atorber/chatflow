import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class BufferAsyncIterable extends AsyncIterableX {
    _source;
    _count;
    _skip;
    constructor(source, count, skip) {
        super();
        this._source = source;
        this._count = count;
        this._skip = skip;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const buffers = [];
        let i = 0;
        for await (const item of wrapWithAbort(this._source, signal)) {
            if (i % this._skip === 0) {
                buffers.push([]);
            }
            for (const buff of buffers) {
                buff.push(item);
            }
            if (buffers.length > 0 && buffers[0].length === this._count) {
                yield buffers.shift();
            }
            i++;
        }
        while (buffers.length > 0) {
            yield buffers.shift();
        }
    }
}
/**
 * Projects each element of an async-iterable sequence into consecutive non-overlapping
 * buffers which are produced based on element count information.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} count The length of each buffer.
 * @param {number} [skip] An optional number of elements to skip between creation of consecutive buffers.
 * @returns {OperatorAsyncFunction<TSource, TSource[]>} An operator which returns anm async-iterable sequence with
 * consecutive non-overlapping buffers based upon element count information.
 */
export function buffer(count, skip) {
    let s = skip;
    if (s == null) {
        s = count;
    }
    return function bufferOperatorFunction(source) {
        return new BufferAsyncIterable(source, count, s);
    };
}
/**
 * Projects each element of an async-iterable sequence into consecutive non-overlapping
 * buffers which are produced based on element count information.
 * @param count Length of each buffer.
 * @param skip Number of elements to skip between creation of consecutive buffers.
 */

//# sourceMappingURL=buffer.mjs.map
