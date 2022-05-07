import { OptionalFindOptions } from './findoptions';
/**
 * Returns the only element of an iterable sequence that matches the predicate if specified,
 * or undefined if no such element exists; this method reports an exception if there is more
 * than one element in the iterable sequence.
 *
 * @template T The type of the elements in the source sequence.
 * @param {AsyncIterable<T>} source Source iterable sequence.
 * @param {OptionalFindOptions<T>} [options] The optional options which includes a predicate for filtering,
 * and thisArg for predicate binding.
 * @returns {(T | undefined)} The single element in the iterable sequence that satisfies
 * the condition in the predicate, or undefined if no such element exists.
 */
export declare function single<T>(source: Iterable<T>, options?: OptionalFindOptions<T>): T | undefined;
