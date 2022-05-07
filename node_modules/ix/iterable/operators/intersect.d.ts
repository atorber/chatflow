import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class IntersectIterable<TSource> extends IterableX<TSource> {
    private _first;
    private _second;
    private _comparer;
    constructor(first: Iterable<TSource>, second: Iterable<TSource>, comparer: (x: TSource, y: TSource) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Produces the set intersection of two iterable sequences.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {Iterable<TSource>} second An iterable sequence whose distinct elements that also
 * appear in the first sequence will be returned.
 * @param {((x: TSource, y: TSource) => boolean)} [comparer=defaultComparer] An equality comparer to compare values.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns a sequence that contains the elements that form the set
 * intersection of two sequences.
 */
export declare function intersect<TSource>(second: Iterable<TSource>, comparer?: (x: TSource, y: TSource) => boolean): MonoTypeOperatorFunction<TSource>;
