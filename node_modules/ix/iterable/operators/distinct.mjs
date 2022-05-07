import { IterableX } from '../iterablex';
import { identity } from '../../util/identity';
import { arrayIndexOf } from '../../util/arrayindexof';
import { comparer as defaultComparer } from '../../util/comparer';
export class DistinctIterable extends IterableX {
    _source;
    _keySelector;
    _cmp;
    constructor(source, keySelector, cmp) {
        super();
        this._source = source;
        this._keySelector = keySelector;
        this._cmp = cmp;
    }
    *[Symbol.iterator]() {
        const set = [];
        for (const item of this._source) {
            const key = this._keySelector(item);
            if (arrayIndexOf(set, key, this._cmp) === -1) {
                set.push(key);
                yield item;
            }
        }
    }
}
/**
 * Returns an iterable sequence that contains only distinct elements according to the keySelector and comparer.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the discriminator key computed for each element in the source sequence.
 * @param {DistinctOptions<TSource, TKey>} [options] The optional arguments for a key selector and comparer function.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns distinct elements according to the keySelector and options.
 */
export function distinct(options) {
    return function distinctOperatorFunction(source) {
        const { ['keySelector']: keySelector = identity, ['comparer']: comparer = defaultComparer } = options || {};
        return new DistinctIterable(source, keySelector, comparer);
    };
}

//# sourceMappingURL=distinct.mjs.map
