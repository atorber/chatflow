import { AsyncIterableX } from './asynciterablex';
/**
 * Returns an async-iterable sequence that invokes the specified factory function whenever a call to [Symbol.asyncIterator] has been made.
 *
 * @template TSource The type of the elements in the sequence returned by the factory function, and in the resulting sequence.
 * @param {((signal?: AbortSignal) => AsyncIterable<TSource> | Promise<AsyncIterable<TSource>>)} factory Async-iterable factory function to
 * invoke for each call to [Symbol.asyncIterator].
 * @returns {AsyncIterableX<TSource>} An async-iterable sequence whose observers trigger an invocation of the given async-iterable factory function.
 */
export declare function defer<TSource>(factory: (signal?: AbortSignal) => AsyncIterable<TSource> | Promise<AsyncIterable<TSource>>): AsyncIterableX<TSource>;
