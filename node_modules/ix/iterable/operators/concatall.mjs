import { ConcatIterable } from '../concat';
/**
 * Concatenates all inner iterable sequences, as long as the previous
 * iterable sequence terminated successfully.
 *
 * @template T The type of elements in the source sequence.
 * @returns {OperatorFunction<Iterable<T>, T>} An operator which concatenates all inner iterable sources.
 */
export function concatAll() {
    return function concatAllOperatorFunction(source) {
        return new ConcatIterable(source);
    };
}

//# sourceMappingURL=concatall.mjs.map
