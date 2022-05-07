import { OptionalFindOptions } from './findoptions';
/**
 * Returns the first element of an async-iterable sequence that matches the predicate if provided, or undefined if no such element exists.
 *
 * @template T The type of the elements in the source sequence.
 * @param {AsyncIterable<T>} source Source async-enumerable sequence.
 * @returns {(Promise<S | undefined>)} A Promise containing the first element in the async-iterable sequence,
 * or a default value if no such element exists.
 */
export declare function first<T>(source: AsyncIterable<T>, options?: OptionalFindOptions<T>): Promise<T | undefined>;
