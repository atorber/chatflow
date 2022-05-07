import { AsyncIterableInput, AsyncIterableX } from './asynciterablex';
/**
 * Converts an existing string into an async-iterable of characters.
 *
 * @param {string} source The string to convert to an async-iterable.
 * @returns {AsyncIterableX<string>} An async-iterable stream of characters from the source.
 */
export declare function as(source: string): AsyncIterableX<string>;
/**
 * Converts the async iterable like input into an async-iterable.
 *
 * @template T The type of elements in the async-iterable like sequence.
 * @param {AsyncIterableInput<T>} source The async-iterable like input to convert to an async-iterable.
 * @returns {AsyncIterableX<T>} An async-iterable stream from elements in the async-iterable like sequence.
 */
export declare function as<T>(source: AsyncIterableInput<T>): AsyncIterableX<T>;
/**
 * Converts the single element into an async-iterable sequence.
 *
 * @template T The type of the input to turn into an async-iterable sequence.
 * @param {T} source The single element to turn into an async-iterable sequence.
 * @returns {AsyncIterableX<T>} An async-iterable sequence which contains the single element.
 */
export declare function as<T>(source: T): AsyncIterableX<T>;
