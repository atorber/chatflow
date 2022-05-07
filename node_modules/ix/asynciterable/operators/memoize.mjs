import { AsyncIterableX } from '../asynciterablex';
import { MaxRefCountList, RefCountList, } from '../../iterable/operators/_refcountlist';
import { create } from '../create';
import { throwIfAborted } from '../../aborterror';
export class MemoizeAsyncBuffer extends AsyncIterableX {
    _source;
    _buffer;
    _shared;
    _error;
    _stopped;
    constructor(source, buffer) {
        super();
        this._error = null;
        this._shared = null;
        this._stopped = false;
        this._source = source;
        this._buffer = buffer;
    }
    [Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        return this._getIterable(0);
    }
    async *_getIterable(offset = 0) {
        let i = offset - 1;
        let done = false;
        const buffer = this._buffer;
        try {
            do {
                if (++i < buffer.count) {
                    yield buffer.get(i);
                    continue;
                }
                if (this._stopped) {
                    throw this._error;
                }
                if (this._shared === null) {
                    this._shared = this._source.next().then((r) => {
                        this._shared = null;
                        if (!r.done) {
                            buffer.push(r.value);
                        }
                        return r;
                    });
                }
                ({ done } = await this._shared.catch((e) => {
                    this._error = e;
                    this._stopped = true;
                    throw e;
                }));
                if (!done) {
                    yield buffer.get(i);
                }
            } while (!done);
        }
        finally {
            buffer.done();
        }
    }
}
/**
 * Memoizes the source sequence within a selector function where a specified number of iterators can get access
 * to all of the sequence's elements without causing multiple iterations over the source.
 *
 * @template TSource Source sequence element type.
 * @template TResult Result sequence element type.
 * @param {number} [readerCount=-1] Number of iterators that can access the underlying buffer. Once every
 * iterator has obtained an element from the buffer, the element is removed from the buffer.
 * @param {(value: AsyncIterable<TSource>) => AsyncIterable<TResult>} [selector] Selector function with memoized access
 * to the source sequence for a specified number of iterators.
 * @returns {(OperatorAsyncFunction<TSource, TSource | TResult>)} Sequence resulting from applying the selector function to the
 * memoized view over the source sequence.
 */
export function memoize(readerCount = -1, selector) {
    return function memoizeOperatorFunction(source) {
        if (!selector) {
            return readerCount === -1
                ? new MemoizeAsyncBuffer(source[Symbol.asyncIterator](), new MaxRefCountList())
                : new MemoizeAsyncBuffer(source[Symbol.asyncIterator](), new RefCountList(readerCount));
        }
        return create(() => selector(memoize(readerCount)(source))[Symbol.asyncIterator]());
    };
}

//# sourceMappingURL=memoize.mjs.map
