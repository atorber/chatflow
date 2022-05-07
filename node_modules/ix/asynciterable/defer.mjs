import { AsyncIterableX } from './asynciterablex';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
class DeferAsyncIterable extends AsyncIterableX {
    _fn;
    constructor(fn) {
        super();
        this._fn = fn;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const items = await this._fn(signal);
        for await (const item of wrapWithAbort(items, signal)) {
            yield item;
        }
    }
}
/**
 * Returns an async-iterable sequence that invokes the specified factory function whenever a call to [Symbol.asyncIterator] has been made.
 *
 * @template TSource The type of the elements in the sequence returned by the factory function, and in the resulting sequence.
 * @param {((signal?: AbortSignal) => AsyncIterable<TSource> | Promise<AsyncIterable<TSource>>)} factory Async-iterable factory function to
 * invoke for each call to [Symbol.asyncIterator].
 * @returns {AsyncIterableX<TSource>} An async-iterable sequence whose observers trigger an invocation of the given async-iterable factory function.
 */
export function defer(factory) {
    return new DeferAsyncIterable(factory);
}

//# sourceMappingURL=defer.mjs.map
