import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class RepeatAsyncIterable extends AsyncIterableX {
    _source;
    _count;
    constructor(source, count) {
        super();
        this._source = source;
        this._count = count;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        if (this._count === -1) {
            while (1) {
                for await (const item of wrapWithAbort(this._source, signal)) {
                    yield item;
                }
            }
        }
        else {
            for (let i = 0; i < this._count; i++) {
                for await (const item of wrapWithAbort(this._source, signal)) {
                    yield item;
                }
            }
        }
    }
}
/**
 * Repeats the async-enumerable sequence a specified number of times.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} [count=-1] Number of times to repeat the sequence. If not specified, the sequence repeats indefinitely.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The async-iterable sequence producing the elements of the given sequence repeatedly.
 */
export function repeat(count = -1) {
    return function repeatOperatorFunction(source) {
        return new RepeatAsyncIterable(source, count);
    };
}

//# sourceMappingURL=repeat.mjs.map
