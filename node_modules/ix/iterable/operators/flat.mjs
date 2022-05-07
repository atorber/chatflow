import { IterableX } from '../iterablex';
import { isIterable } from '../../util/isiterable';
export class FlattenIterable extends IterableX {
    _source;
    _depth;
    constructor(source, depth) {
        super();
        this._source = source;
        this._depth = depth;
    }
    // eslint-disable-next-line consistent-return
    *_flatten(source, depth) {
        if (depth === 0) {
            for (const item of source) {
                yield item;
            }
            return undefined;
        }
        for (const item of source) {
            if (isIterable(item)) {
                for (const innerItem of this._flatten(item, depth - 1)) {
                    yield innerItem;
                }
            }
            else {
                yield item;
            }
        }
    }
    [Symbol.iterator]() {
        return this._flatten(this._source, this._depth)[Symbol.iterator]();
    }
}
/**
 * Flattens the nested iterable by the given depth.
 *
 * @template T The type of elements in the source sequence.
 * @param {number} [depth=Infinity] The depth to flatten the iterable sequence if specified, otherwise infinite.
 * @returns {MonoTypeOperatorFunction<T>} An operator that flattens the iterable sequence.
 */
export function flat(depth = Infinity) {
    return function flattenOperatorFunction(source) {
        return new FlattenIterable(source, depth);
    };
}

//# sourceMappingURL=flat.mjs.map
