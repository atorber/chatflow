/**
 *  Determines whether an itreable includes a certain value among its entries, returning true or false as appropriate.
 *
 * @template T The type of elements in the source sequence.
 * @param {Iterable<T>} source The source sequence to search for the item.
 * @param {T} valueToFind The value to search for.
 * @param {number} [fromIndex=0] The position in this iterable at which to begin searching for valueToFind.
 * @returns {boolean} Returns true if the value valueToFind is found within the iterable.
 */
export declare function includes<T>(source: Iterable<T>, searchElement: T, fromIndex?: number): boolean;
