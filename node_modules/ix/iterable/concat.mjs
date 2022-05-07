import { IterableX } from './iterablex';
export class ConcatIterable extends IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        for (const outer of this._source) {
            yield* outer;
        }
    }
}
/**
 * Concatenates all iterable sequences in the given sequences, as long as the previous iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...Iterable<T>[]} args The iterable sources.
 * @returns {IterableX<T>} An iterable sequence that contains the elements of each given sequence, in sequential order.
 */
export function concat(...args) {
    return new ConcatIterable(args);
}

//# sourceMappingURL=concat.mjs.map
