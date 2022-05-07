import { AsyncIterableX } from '../asynciterablex';
import { identityAsync } from '../../util/identity';
import { comparerAsync } from '../../util/comparer';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class DistinctUntilChangedAsyncIterable extends AsyncIterableX {
    _source;
    _keySelector;
    _comparer;
    constructor(source, keySelector, comparer) {
        super();
        this._source = source;
        this._keySelector = keySelector;
        this._comparer = comparer;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let currentKey;
        let hasCurrentKey = false;
        for await (const item of wrapWithAbort(this._source, signal)) {
            const key = await this._keySelector(item, signal);
            let comparerEquals = false;
            if (hasCurrentKey) {
                comparerEquals = await this._comparer(currentKey, key);
            }
            if (!hasCurrentKey || !comparerEquals) {
                hasCurrentKey = true;
                currentKey = key;
                yield item;
            }
        }
    }
}
/**
 * Returns an async-iterable sequence that contains only distinct contiguous elements according to the optional keySelector and comparer.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the discriminator key computed for each element in the source sequence.
 * @param {DistinctOptions<TSource, TKey = TSource>} [options] The optional options for adding a key selector and comparer.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that returns an async-iterable that contains only distinct contiguous items.
 */
export function distinctUntilChanged(options) {
    return function distinctUntilChangedOperatorFunction(source) {
        const { ['keySelector']: keySelector = identityAsync, ['comparer']: comparer = comparerAsync } = options || {};
        return new DistinctUntilChangedAsyncIterable(source, keySelector, comparer);
    };
}

//# sourceMappingURL=distinctuntilchanged.mjs.map
