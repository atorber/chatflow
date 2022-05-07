import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class UnionIterable<TSource> extends IterableX<TSource> {
    private _left;
    private _right;
    private _comparer;
    constructor(left: Iterable<TSource>, right: Iterable<TSource>, comparer: (x: TSource, y: TSource) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Produces the set union of two sequences by using the given equality comparer.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {AsyncIterable<TSource>} right An iterable sequence whose distinct elements form the second set for the union.
 * @param {((x: TSource, y: TSource) => boolean)} [comparer=defaultComparer] The equality comparer to compare values.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the elements from both input sequences,
 * excluding duplicates.
 */
export declare function union<TSource>(right: Iterable<TSource>, comparer?: (x: TSource, y: TSource) => boolean): MonoTypeOperatorFunction<TSource>;
