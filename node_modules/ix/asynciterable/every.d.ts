import { FindOptions } from './findoptions';
/**
 * Determines whether all elements of an async-iterable sequence satisfy a condition.
 *
 * @template T The type of the elements in the source sequence.
 * @param {AsyncIterable<T>} source An async-iterable sequence whose elements to apply the predicate to.
 * @param {FindOptions<T>} options The options for a predicate for filtering, thisArg for binding and AbortSignal for cancellation.
 * @returns {Promise<boolean>} An async-iterable sequence containing a single element determining whether all elements in the
 * source sequence pass the test in the specified predicate.
 */
export declare function every<T>(source: AsyncIterable<T>, options: FindOptions<T>): Promise<boolean>;
