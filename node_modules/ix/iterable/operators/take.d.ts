import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class TakeIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _count;
    constructor(source: Iterable<TSource>, count: number);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Returns a specified number of contiguous elements from the start of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count The number of elements to return.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence that contains the specified
 * number of elements from the start of the input sequence.
 */
export declare function take<TSource>(count: number): MonoTypeOperatorFunction<TSource>;
