import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted, AbortError } from '../aborterror';
export class NeverAsyncIterable extends AsyncIterableX {
    constructor() {
        super();
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        await new Promise((_, reject) => {
            if (signal) {
                signal.addEventListener('abort', () => reject(new AbortError()), { once: true });
            }
        });
    }
}
/**
 * An async-iterable sequence that never returns a value.
 *
 * @returns {AsyncIterableX<never>} An async-iterable sequence that never returns a value.
 */
export function never() {
    return new NeverAsyncIterable();
}

//# sourceMappingURL=never.mjs.map
