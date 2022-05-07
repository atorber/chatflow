import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class GroupJoinIterable<TOuter, TInner, TKey, TResult> extends IterableX<TResult> {
    private _outer;
    private _inner;
    private _outerSelector;
    private _innerSelector;
    private _resultSelector;
    constructor(outer: Iterable<TOuter>, inner: Iterable<TInner>, outerSelector: (value: TOuter) => TKey, innerSelector: (value: TInner) => TKey, resultSelector: (outer: TOuter, inner: Iterable<TInner>) => TResult);
    [Symbol.iterator](): Generator<TResult, void, unknown>;
}
/**
 * Correlates the elements of two iterable sequences based on equality of keys and groups the results.
 *
 * @template TOuter The type of the elements of the first iterable sequence.
 * @template TInner The type of the elements of the second iterable sequence.
 * @template TKey The type of the keys returned by the key selector functions.
 * @template TResult The type of the result elements.
 * @param {Iterable<TInner>} inner The async-enumerable sequence to join to the first sequence.
 * @param {((value: TOuter) => TKey)} outerSelector A function to extract the join key from each
 * element of the first sequence.
 * @param {((value: TInner) => TKey)} innerSelector A function to extract the join key from each
 * element of the second sequence.
 * @param {((outer: TOuter, inner: Iterable<TInner>) => TResult)} resultSelector A function to create a result
 * element from an element from the first sequence and a collection of matching elements from the second sequence.
 * @returns {OperatorFunction<TOuter, TResult>} An operator that returns an iterable sequence that contains the result elements
 * that are obtained by performing a grouped join on two sequences.
 */
export declare function groupJoin<TOuter, TInner, TKey, TResult>(inner: Iterable<TInner>, outerSelector: (value: TOuter) => TKey, innerSelector: (value: TInner) => TKey, resultSelector: (outer: TOuter, inner: Iterable<TInner>) => TResult): OperatorFunction<TOuter, TResult>;
