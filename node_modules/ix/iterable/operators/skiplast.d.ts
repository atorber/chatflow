import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class SkipLastIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _count;
    constructor(source: Iterable<TSource>, count: number);
    [Symbol.iterator](): Generator<NonNullable<TSource>, void, unknown>;
}
/**
 * Bypasses a specified number of elements at the end of an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} count Number of elements to bypass at the end of the source sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable sequence containing the
 * source sequence elements except for the bypassed ones at the end.
 */
export declare function skipLast<TSource>(count: number): MonoTypeOperatorFunction<TSource>;
