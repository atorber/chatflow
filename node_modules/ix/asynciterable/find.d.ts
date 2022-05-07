import { FindOptions } from './findoptions';
/**
 * Returns the value of the first element in the provided async-iterable that satisfies the provided testing function.
 *
 * @template T The type of the elements in the source sequence.
 * @param {AsyncIterable<T>} source An async-iterable sequence whose elements to apply the predicate to.
 * @param {FindOptions<T>} options The options for a predicate for filtering, thisArg for binding and AbortSignal for cancellation.
 * @returns {(Promise<S | undefined>)} A promise with the value of the first element that matches the predicate.
 */
export declare function find<T>(source: AsyncIterable<T>, options: FindOptions<T>): Promise<T | undefined>;
