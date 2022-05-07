import { IterableX } from '../iterablex';
import { bindCallback } from '../../util/bindcallback';
export class MapIterable extends IterableX {
    _source;
    _selector;
    constructor(source, selector) {
        super();
        this._source = source;
        this._selector = selector;
    }
    *[Symbol.iterator]() {
        let i = 0;
        for (const item of this._source) {
            yield this._selector(item, i++);
        }
    }
}
/**
 * Projects each element of an async-enumerable sequence into a new form.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the result sequence, obtained by running the selector
 * function for each element in the source sequence.
 * @param {((value: TSource, index: number) => TResult)} selector A transform function
 * to apply to each source element.
 * @param {*} [thisArg] Optional this for binding to the selector.
 * @returns {OperatorFunction<TSource, TResult>} An iterable sequence whose elements are the result of invoking the transform
 * function on each element of source.
 */
export function map(selector, thisArg) {
    return function mapOperatorFunction(source) {
        return new MapIterable(source, bindCallback(selector, thisArg, 2));
    };
}

//# sourceMappingURL=map.mjs.map
