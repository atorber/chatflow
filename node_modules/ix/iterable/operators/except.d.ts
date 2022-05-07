import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class ExceptIterable<TSource> extends IterableX<TSource> {
    private _first;
    private _second;
    private _comparer;
    constructor(first: Iterable<TSource>, second: Iterable<TSource>, comparer: (x: TSource, y: TSource) => boolean);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 *  Produces the set difference of two iterable sequences by using the specified equality comparer to compare values.
 *
 * @template TSource The type of the elements of the input sequences.
 * @param {Iterable<TSource>} second An iterable sequence whose elements that also occur in the
 * operator sequence will cause those elements to be removed from the returned sequence.
 * @param {((x: TSource, y: TSource) => boolean} [comparer=defaultComparer] An equality comparer to compare values
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns a sequence that contains the set
 * difference of the elements of two sequences.
 */
export declare function except<TSource>(second: Iterable<TSource>, comparer?: (x: TSource, y: TSource) => boolean): MonoTypeOperatorFunction<TSource>;
