import { IterableX } from '../iterablex';
export class FlatMapIterable extends IterableX {
    _source;
    _fn;
    _thisArg;
    constructor(source, fn, thisArg) {
        super();
        this._source = source;
        this._fn = fn;
        this._thisArg = thisArg;
    }
    *[Symbol.iterator]() {
        let index = 0;
        for (const outerItem of this._source) {
            for (const innerItem of this._fn.call(this._thisArg, outerItem, index++)) {
                yield innerItem;
            }
        }
    }
}
/**
 * Projects each element of an iterable sequence to an iterable sequence and merges
 * the resulting iterable sequences into one iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the projected inner sequences and the elements in the merged result sequence.
 * @param {((value: TSource, index: number) => Iterable<TResult>)} selector A transform function to apply to each element.
 * @param {*} [thisArg] Option this for binding to the selector.
 * @returns {OperatorFunction<TSource, TResult>} An operator that creates an iterable sequence whose
 * elements are the result of invoking the one-to-many transform function on each element of the input sequence.
 */
export function flatMap(selector, thisArg) {
    return function flatMapOperatorFunction(source) {
        return new FlatMapIterable(source, selector, thisArg);
    };
}

//# sourceMappingURL=flatmap.mjs.map
