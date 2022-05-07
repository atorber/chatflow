import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class IgnoreElementsIterable<TSource> extends IterableX<TSource> {
    private _source;
    constructor(source: Iterable<TSource>);
    [Symbol.iterator](): Iterator<TSource>;
}
/**
 * Ignores all elements in an iterable sequence leaving only the termination messages.
 *
 * @template TSource The type of the elements in the source sequence
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns an empty iterable sequence
 * that signals termination, successful or exceptional, of the source sequence.
 */
export declare function ignoreElements<TSource>(): MonoTypeOperatorFunction<TSource>;
