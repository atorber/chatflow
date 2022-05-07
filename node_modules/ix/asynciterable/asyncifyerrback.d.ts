import { AsyncIterableX } from './asynciterablex';
/**
 * Converts a Node.js style error first callback to an async-iterable sequence.
 *
 * @template TSource The type of the returned value from the callback.
 * @param {Function} func The Node.js error first callback to convert to an async-iterable.
 * @returns {(...args: any[]) => AsyncIterableX<TSource>} A function, when invoked, contains the result of the callback as an async-iterable.
 */
export declare function asyncifyErrback<TSource>(func: (...xs: any[]) => any): (...args: any[]) => AsyncIterableX<TSource>;
