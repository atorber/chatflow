import { AsyncIterableX } from './asynciterablex';
export declare class NeverAsyncIterable extends AsyncIterableX<never> {
    constructor();
    [Symbol.asyncIterator](signal?: AbortSignal): AsyncGenerator<never, void, unknown>;
}
/**
 * An async-iterable sequence that never returns a value.
 *
 * @returns {AsyncIterableX<never>} An async-iterable sequence that never returns a value.
 */
export declare function never(): AsyncIterableX<never>;
