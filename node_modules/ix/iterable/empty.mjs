import { IterableX } from './iterablex';
class EmptyIterable extends IterableX {
    *[Symbol.iterator]() {
        // eslint-disable-next-line no-empty
    }
}
/**
 * Returns an empty iterable sequence.
 *
 * @template TSource The type used for the iterable type parameter of the resulting sequence.
 * @returns {IterableX<never>} An iterable sequence with no elements.
 */
export function empty() {
    return new EmptyIterable();
}

//# sourceMappingURL=empty.mjs.map
