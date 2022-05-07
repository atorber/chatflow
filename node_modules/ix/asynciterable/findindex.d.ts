import { FindOptions } from './findoptions';
/**
 * Returns the a Promise containing the index of the first element in the array that satisfies the provided testing function.
 * Otherwise, it returns a Promise with -1, indicating that no element passed the test.
 *
 * @template T The type of the elements in the source sequence.
 * @param {AsyncIterable<T>} source An async-iterable sequence whose elements to apply the predicate to.
 * @param {FindOptions<T>} options The options for a predicate for filtering, thisArg for binding and AbortSignal for cancellation.
 * @returns {Promise<number>} A promise containing the index of the first element in the array that passes the test. Otherwise, -1.
 */
export declare function findIndex<T>(source: AsyncIterable<T>, options: FindOptions<T>): Promise<number>;
