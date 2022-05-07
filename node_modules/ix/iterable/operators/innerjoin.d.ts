import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class JoinIterable<TOuter, TInner, TKey, TResult> extends IterableX<TResult> {
    private _outer;
    private _inner;
    private _outerSelector;
    private _innerSelector;
    private _resultSelector;
    constructor(outer: Iterable<TOuter>, inner: Iterable<TInner>, outerSelector: (value: TOuter) => TKey, innerSelector: (value: TInner) => TKey, resultSelector: (outer: TOuter, inner: TInner) => TResult);
    [Symbol.iterator](): Generator<TResult, void, unknown>;
}
/**
 * Correlates the elements of two sequences based on matching keys.
 *
 * @template TOuter The type of the elements of the first iterable sequence.
 * @template TInner The type of the elements of the second iterable sequence.
 * @template TKey The type of the keys returned by the key selector functions.
 * @template TResult The type of the result elements.
 * @param {Iterable<TInner>} inner The async-enumerable sequence to join to the first sequence.
 * @param {((value: TOuter) => TKey)} outerSelector A function to extract the join key from each element
 * of the first sequence.
 * @param {((value: TInner) => TKey)} innerSelector A function to extract the join key from each element
 * of the second sequence.
 * @param {((outer: TOuter, inner: TInner) => TResult)} resultSelector A function to create a result element
 * from two matching elements.
 * @returns {OperatorFunction<TOuter, TResult>} An iterable sequence that has elements that are obtained by performing an inner join
 * on two sequences.
 */
export declare function innerJoin<TOuter, TInner, TKey, TResult>(inner: Iterable<TInner>, outerSelector: (value: TOuter) => TKey, innerSelector: (value: TInner) => TKey, resultSelector: (outer: TOuter, inner: TInner) => TResult): OperatorFunction<TOuter, TResult>;
