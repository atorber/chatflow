import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
class AnonymousAsyncIterable extends AsyncIterableX {
    _fn;
    constructor(fn) {
        super();
        this._fn = fn;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const it = await this._fn(signal);
        let next;
        while (!(next = await it.next()).done) {
            yield next.value;
        }
    }
}
/**
 * Creates a new iterable using the specified function implementing the members of AsyncIterable
 *
 * @template T The type of the elements returned by the enumerable sequence.
 * @param {((signal?: AbortSignal) => AsyncIterator<T> | Promise<AsyncIterator<T>>)} fn The function that creates the [Symbol.asyncIterator]() method
 * @returns {AsyncIterableX<T>} A new async-iterable instance.
 */
export function create(fn) {
    return new AnonymousAsyncIterable(fn);
}

//# sourceMappingURL=create.mjs.map
