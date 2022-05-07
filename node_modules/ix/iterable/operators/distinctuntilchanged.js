"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinctUntilChanged = exports.DistinctUntilChangedIterable = void 0;
const iterablex_1 = require("../iterablex");
const identity_1 = require("../../util/identity");
const comparer_1 = require("../../util/comparer");
class DistinctUntilChangedIterable extends iterablex_1.IterableX {
    _source;
    _keySelector;
    _comparer;
    constructor(source, keySelector, comparer) {
        super();
        this._source = source;
        this._keySelector = keySelector;
        this._comparer = comparer;
    }
    *[Symbol.iterator]() {
        let currentKey = {};
        let hasCurrentKey = false;
        for (const item of this._source) {
            const key = this._keySelector(item);
            let comparerEquals = false;
            if (hasCurrentKey) {
                comparerEquals = this._comparer(currentKey, key);
            }
            if (!hasCurrentKey || !comparerEquals) {
                hasCurrentKey = true;
                currentKey = key;
                yield item;
            }
        }
    }
}
exports.DistinctUntilChangedIterable = DistinctUntilChangedIterable;
/**
 * Returns an async-iterable sequence that contains only distinct contiguous elements according to the optional keySelector and comparer.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the discriminator key computed for each element in the source sequence.
 * @param {DistinctOptions<TSource, TKey = TSource>} [options] The optional options for adding a key selector and comparer.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns an async-iterable that contains only distinct contiguous items.
 */
function distinctUntilChanged(options) {
    return function distinctUntilChangedOperatorFunction(source) {
        const { ['keySelector']: keySelector = identity_1.identity, ['comparer']: comparer = comparer_1.comparer } = options || {};
        return new DistinctUntilChangedIterable(source, keySelector, comparer);
    };
}
exports.distinctUntilChanged = distinctUntilChanged;

//# sourceMappingURL=distinctuntilchanged.js.map
