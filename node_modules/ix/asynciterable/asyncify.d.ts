import { AsyncIterableX } from './asynciterablex';
/**
 * Converts the callback function into wrapped function which returns an async-iterable.
 *
 * @template TSource The type of the value returned from the callback.
 * @param {Function} func The callback function to wrap as an async-iterable.
 * @returns {(...args: any[]) => AsyncIterableX<TSource>} A function when invoked, returns an async-iterable from the callback.
 */
export declare function asyncify<TSource>(func: (...xs: any[]) => any): (...args: any[]) => AsyncIterableX<TSource>;
