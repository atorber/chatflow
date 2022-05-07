import { ConcatIterable } from '../concat';
/**
 * Concatenates all iterable sequences in the given sequences, as long as the previous iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...Iterable<T>[]} args The iterable sources.
 * @returns {AsyncIterableX<T>} An iterable sequence that contains the elements of each given sequence, in sequential order.
 */
export function concatWith(...args) {
    return function concatWithOperatorFunction(source) {
        return new ConcatIterable([source, ...args]);
    };
}

//# sourceMappingURL=concatwith.mjs.map
