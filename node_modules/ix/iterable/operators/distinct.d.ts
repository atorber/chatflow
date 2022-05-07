import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
import { DistinctOptions } from './distinctoptions';
export declare class DistinctIterable<TSource, TKey = TSource> extends IterableX<TSource> {
    private _source;
    private _keySelector;
    private _cmp;
    constructor(source: Iterable<TSource>, keySelector: (value: TSource) => TKey, cmp: (x: TKey, y: TKey) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Returns an iterable sequence that contains only distinct elements according to the keySelector and comparer.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TKey The type of the discriminator key computed for each element in the source sequence.
 * @param {DistinctOptions<TSource, TKey>} [options] The optional arguments for a key selector and comparer function.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns distinct elements according to the keySelector and options.
 */
export declare function distinct<TSource, TKey = TSource>(options?: DistinctOptions<TSource, TKey>): MonoTypeOperatorFunction<TSource>;
