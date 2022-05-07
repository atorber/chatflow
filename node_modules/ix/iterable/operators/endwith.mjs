import { IterableX } from '../iterablex';
export class EndWithIterable extends IterableX {
    _source;
    _args;
    constructor(source, args) {
        super();
        this._source = source;
        this._args = args;
    }
    *[Symbol.iterator]() {
        for (const item of this._source) {
            yield item;
        }
        for (const x of this._args) {
            yield x;
        }
    }
}
/**
 * Append values to an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {...TSource[]} args The values to append to the end of the iterable sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator which appends values to the end of the sequence.
 */
export function endWith(...args) {
    return function endsWithOperatorFunction(source) {
        return new EndWithIterable(source, args);
    };
}

//# sourceMappingURL=endwith.mjs.map
