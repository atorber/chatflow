import { AsyncIterableX } from './asynciterablex';
/**
 * Creates a new iterable using the specified function implementing the members of AsyncIterable
 *
 * @template T The type of the elements returned by the enumerable sequence.
 * @param {((signal?: AbortSignal) => AsyncIterator<T> | Promise<AsyncIterator<T>>)} fn The function that creates the [Symbol.asyncIterator]() method
 * @returns {AsyncIterableX<T>} A new async-iterable instance.
 */
export declare function create<T>(fn: (signal?: AbortSignal) => AsyncIterator<T> | Promise<AsyncIterator<T>>): AsyncIterableX<T>;
