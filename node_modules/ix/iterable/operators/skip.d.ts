import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class SkipIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _count;
    constructor(source: Iterable<TSource>, count: number);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Bypasses a specified number of elements in an iterable sequence and then returns the remaining elements.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to skip before returning the remaining elements.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the elements that
 * occur after the specified index in the input sequence.
 */
export declare function skip<TSource>(count: number): MonoTypeOperatorFunction<TSource>;
