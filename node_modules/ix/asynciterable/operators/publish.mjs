import { RefCountList } from '../../iterable/operators/_refcountlist';
import { create } from '../create';
import { MemoizeAsyncBuffer } from './memoize';
import { throwIfAborted } from '../../aborterror';
class PublishedAsyncBuffer extends MemoizeAsyncBuffer {
    constructor(source) {
        super(source, new RefCountList(0));
    }
    [Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        this._buffer.readerCount++;
        return this._getIterable(this._buffer.count)[Symbol.asyncIterator]();
    }
}
/**
 * Buffer enabling each iterator to retrieve elements from the shared source sequence, starting from the
 * index at the point of obtaining the iterator.
 *
 * @template TSource Source sequence element type.
 * @template TResult Result sequence element type.
 * @param {(value: AsyncIterable<TSource>) => AsyncIterable<TResult>} [selector] Selector function with published
 * access to the source sequence for each iterator.
 * @returns {(OperatorAsyncFunction<TSource, TSource | TResult>)} Sequence resulting from applying the selector function to the
 * published view over the source sequence.
 */
export function publish(selector) {
    return function publishOperatorFunction(source) {
        return selector
            ? create(async () => selector(publish()(source))[Symbol.asyncIterator]())
            : new PublishedAsyncBuffer(source[Symbol.asyncIterator]());
    };
}

//# sourceMappingURL=publish.mjs.map
