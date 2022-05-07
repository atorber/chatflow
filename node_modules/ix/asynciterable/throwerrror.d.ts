import { AsyncIterableX } from './asynciterablex';
/**
 * Creates an async-iterable that throws the specified error upon iterating.
 *
 * @param {*} error The error to throw upon iterating the async-iterable.
 * @returns {AsyncIterableX<never>} An async-iterable that throws when iterated.
 */
export declare function throwError(error: any): AsyncIterableX<never>;
