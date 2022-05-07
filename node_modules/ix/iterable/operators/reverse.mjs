import { IterableX } from '../iterablex';
export class ReverseIterable extends IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        const results = [];
        for (const item of this._source) {
            results.unshift(item);
        }
        yield* results;
    }
}
/**
 * Reverses the iterable instance.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The iterable in reversed sequence.
 */
export function reverse() {
    return function reverseOperatorFunction(source) {
        return new ReverseIterable(source);
    };
}

//# sourceMappingURL=reverse.mjs.map
