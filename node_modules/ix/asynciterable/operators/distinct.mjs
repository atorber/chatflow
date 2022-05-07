import { AsyncIterableX } from './../asynciterablex';
import { identityAsync } from '../../util/identity';
import { arrayIndexOfAsync } from '../../util/arrayindexof';
import { comparerAsync } from '../../util/comparer';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class DistinctAsyncIterable extends AsyncIterableX {
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
        const set = [];
        for await (const item of wrapWithAbort(this._source, signal)) {
            const key = await this._keySelector(item, signal);
            if ((await arrayIndexOfAsync(set, key, this._comparer)) === -1) {
                set.push(key);
                yield item;
            }
        }
    }
}
/**
 * Returns an async-iterable sequence that contains only distinct elements according to the keySelector and comparer.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the discriminator key computed for each element in the source sequence.
 * @param {DistinctOptions<TSource, TKey = TSource>} [options] The optional arguments for a key selector and comparer function.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that returns distinct elements according to the keySelector and options.
 */
export function distinct(options) {
    return function distinctOperatorFunction(source) {
        const { ['keySelector']: keySelector = identityAsync, ['comparer']: comparer = comparerAsync } = options || {};
        return new DistinctAsyncIterable(source, keySelector, comparer);
    };
}

//# sourceMappingURL=distinct.mjs.map
