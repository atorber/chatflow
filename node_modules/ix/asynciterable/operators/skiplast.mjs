import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class SkipLastAsyncIterable extends AsyncIterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const q = [];
        for await (const item of wrapWithAbort(this._source, signal)) {
            q.push(item);
            if (q.length > this._count) {
                yield q.shift();
            }
        }
    }
}
/**
 * Bypasses a specified number of elements at the end of an async-iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to bypass at the end of the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable sequence containing the
 * source sequence elements except for the bypassed ones at the end.
 */
export function skipLast(count) {
    return function skipLastOperatorFunction(source) {
        return new SkipLastAsyncIterable(source, count);
    };
}

//# sourceMappingURL=skiplast.mjs.map
