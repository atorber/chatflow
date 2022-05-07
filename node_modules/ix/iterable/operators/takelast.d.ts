import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class TakeLastIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _count;
    constructor(source: Iterable<TSource>, count: number);
    [Symbol.iterator](): Generator<NonNullable<TSource>, void, unknown>;
}
/**
 * Returns a specified number of contiguous elements from the end of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to take from the end of the source sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence containing the specified
 * number of elements from the end of the source sequence.
 */
export declare function takeLast<TSource>(count: number): MonoTypeOperatorFunction<TSource>;
