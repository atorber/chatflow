import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class ExpandIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _fn;
    constructor(source: Iterable<TSource>, fn: (value: TSource) => Iterable<TSource>);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Expands (breadth first) the iterable sequence by recursively applying a selector function to generate more sequences at each recursion level.
 *
 * @template TSource Source sequence element type.
 * @param {(( value: TSource) => Iterable<TSource>)} selector Selector function to retrieve the next sequence to expand.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator which returns a sequence with results
 * from the recursive expansion of the source sequence.
 */
export declare function expand<TSource>(selector: (value: TSource) => Iterable<TSource>): MonoTypeOperatorFunction<TSource>;
