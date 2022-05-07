import { IterableX } from '../iterablex';
export class ExpandIterable extends IterableX {
    _source;
    _fn;
    constructor(source, fn) {
        super();
        this._source = source;
        this._fn = fn;
    }
    *[Symbol.iterator]() {
        const q = [this._source];
        while (q.length > 0) {
            const src = q.shift();
            for (const item of src) {
                q.push(this._fn(item));
                yield item;
            }
        }
    }
}
/**
 * Expands (breadth first) the iterable sequence by recursively applying a selector function to generate more sequences at each recursion level.
 *
 * @template TSource Source sequence element type.
 * @param {(( value: TSource) => Iterable<TSource>)} selector Selector function to retrieve the next sequence to expand.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator which returns a sequence with results
 * from the recursive expansion of the source sequence.
 */
export function expand(selector) {
    return function expandOperatorFunction(source) {
        return new ExpandIterable(source, selector);
    };
}

//# sourceMappingURL=expand.mjs.map
