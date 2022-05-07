import { AsyncIterableX } from '../asynciterablex';
import { create } from '../create';
import { throwIfAborted } from '../../aborterror';
class SharedAsyncIterable extends AsyncIterableX {
    _it;
    constructor(it) {
        super();
        this._it = {
            next(value) {
                return it.next(value);
            },
        };
    }
    [Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        return this._it;
    }
}
/**
 * Shares the source sequence within a selector function where each iterator can fetch the next element from the
 * source sequence.
 *
 * @template TSource Source sequence element type.
 * @template TResult Result sequence element type.
 * @param {((
 *     value: AsyncIterable<TSource>,
 *     signal?: AbortSignal
 *   ) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>)} [selector] Selector function with shared access
 * to the source sequence for each iterator.
 * @returns {(OperatorAsyncFunction<TSource, TSource | TResult>)} Sequence resulting from applying the selector function to the
 * shared view over the source sequence.
 */
export function share(selector) {
    return function shareOperatorFunction(source) {
        return selector
            ? create(async (signal) => {
                const it = await selector(new SharedAsyncIterable(source[Symbol.asyncIterator](signal)), signal);
                return it[Symbol.asyncIterator](signal);
            })
            : new SharedAsyncIterable(source[Symbol.asyncIterator]());
    };
}

//# sourceMappingURL=share.mjs.map
