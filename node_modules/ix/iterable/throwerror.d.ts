import { IterableX } from './iterablex';
/**
 * Creates an async-iterable that throws the specified error upon iterating.
 *
 * @param {*} error The error to throw upon iterating the iterable.
 * @returns {AsyncIterableX<never>} An iterable that throws when iterated.
 */
export declare function throwError<TSource = any>(error: any): IterableX<TSource>;
