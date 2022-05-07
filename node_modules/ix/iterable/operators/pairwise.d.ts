import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class PairwiseIterable<TSource> extends IterableX<TSource[]> {
    private _source;
    constructor(source: Iterable<TSource>);
    [Symbol.iterator](): Generator<TSource[], void, unknown>;
}
/**
 * Returns a sequence of each element in the input sequence and its predecessor, with the exception of the
 * first element which is only returned as the predecessor of the second element.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {OperatorFunction<TSource, TSource[]>} The result sequence.
 */
export declare function pairwise<TSource>(): OperatorFunction<TSource, TSource[]>;
