import { IterableX } from './iterablex';
/**
 * Creates an iterable from the specified elements.
 *
 * @template TSource The type of the elements to create an iterable sequence.
 * @param {...TSource[]} args The elements to turn into an iterable sequence.
 * @returns {IterableX<TSource>} The iterable sequence created from the elements.
 */
export function of(...args) {
    return new OfIterable(args);
}
export class OfIterable extends IterableX {
    _args;
    constructor(args) {
        super();
        this._args = args;
    }
    *[Symbol.iterator]() {
        yield* this._args;
    }
}

//# sourceMappingURL=of.mjs.map
