import { IterableX } from '../iterablex';
export class StartWithIterable extends IterableX {
    _source;
    _args;
    constructor(source, args) {
        super();
        this._source = source;
        this._args = args;
    }
    *[Symbol.iterator]() {
        for (const x of this._args) {
            yield x;
        }
        for (const item of this._source) {
            yield item;
        }
    }
}
/**
 * Prepend a value to an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {...TSource[]} args Elements to prepend to the specified sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} The source sequence prepended with the specified values.
 */
export function startWith(...args) {
    return function startWithOperatorFunction(source) {
        return new StartWithIterable(source, args);
    };
}

//# sourceMappingURL=startwith.mjs.map
