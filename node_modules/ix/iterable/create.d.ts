import { IterableX } from './iterablex';
/**
 * Creates a new iterable using the specified function implementing the members of AsyncIterable
 *
 * @template T The type of the elements returned by the iterable sequence.
 * @param {(() => Iterator<T>)} fn The function that creates the [Symbol.iterator]() method
 * @returns {IterableX<T>} A new iterable instance.
 */
export declare function create<T>(getIterator: () => Iterator<T>): IterableX<T>;
