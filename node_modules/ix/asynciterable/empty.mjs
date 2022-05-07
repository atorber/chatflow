import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
class EmptyAsyncIterable extends AsyncIterableX {
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
    }
}
/**
 * Returns an empty async-iterable sequence.
 *
 * @template TSource The type used for the async-iterable type parameter of the resulting sequence.
 * @returns {AsyncIterableX<never>} An async-iterable sequence with no elements.
 */
export function empty() {
    return new EmptyAsyncIterable();
}

//# sourceMappingURL=empty.mjs.map
