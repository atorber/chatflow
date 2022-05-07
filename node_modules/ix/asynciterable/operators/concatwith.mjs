import { ConcatAsyncIterable } from '../concat';
/**
 * Concatenates all async-iterable sequences in the given sequences, as long as the previous async-iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...AsyncIterable<T>[]} args The async-iterable sources.
 * @returns {AsyncIterableX<T>} An async-iterable sequence that contains the elements of each given sequence, in sequential order.
 */
export function concatWith(...args) {
    return function concatWithOperatorFunction(source) {
        return new ConcatAsyncIterable([source, ...args]);
    };
}

//# sourceMappingURL=concatwith.mjs.map
