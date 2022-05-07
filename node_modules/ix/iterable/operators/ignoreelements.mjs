import { IterableX } from '../iterablex';
export class IgnoreElementsIterable extends IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        const it = this._source[Symbol.iterator]();
        while (!it.next().done) {
            /* intentionally empty */
        }
    }
}
/**
 * Ignores all elements in an iterable sequence leaving only the termination messages.
 *
 * @template TSource The type of the elements in the source sequence
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns an empty iterable sequence
 * that signals termination, successful or exceptional, of the source sequence.
 */
export function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return new IgnoreElementsIterable(source);
    };
}

//# sourceMappingURL=ignoreelements.mjs.map
