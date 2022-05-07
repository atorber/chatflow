import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
import { DistinctOptions } from './distinctoptions';
export declare class DistinctUntilChangedIterable<TSource, TKey = TSource> extends IterableX<TSource> {
    private _source;
    private _keySelector;
    private _comparer;
    constructor(source: Iterable<TSource>, keySelector: (value: TSource) => TKey, comparer: (first: TKey, second: TKey) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Returns an async-iterable sequence that contains only distinct contiguous elements according to the optional keySelector and comparer.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the discriminator key computed for each element in the source sequence.
 * @param {DistinctOptions<TSource, TKey = TSource>} [options] The optional options for adding a key selector and comparer.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns an async-iterable that contains only distinct contiguous items.
 */
export declare function distinctUntilChanged<TSource, TKey = TSource>(options?: DistinctOptions<TSource, TKey>): MonoTypeOperatorFunction<TSource>;
