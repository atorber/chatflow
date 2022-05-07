import { FindOptions } from './findoptions';
/**
 * Determines whether all elements of an iterable sequence satisfy a condition.
 *
 * @template T The type of the elements in the source sequence.
 * @param {Iterable<T>} source An iterable sequence whose elements to apply the predicate to.
 * @param {FindOptions<T>} options The options for a predicate for filtering, thisArg for binding and AbortSignal for cancellation.
 * @returns {boolean} A boolean determining whether all elements in the source sequence pass the test in the specified predicate.
 */
export declare function every<T>(source: Iterable<T>, options: FindOptions<T>): boolean;
