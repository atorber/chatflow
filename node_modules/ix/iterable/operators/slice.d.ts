import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class SliceIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _begin;
    private _end;
    constructor(source: Iterable<TSource>, begin: number, end: number);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Returns the elements from the source iterable sequence only after the function that returns a promise produces an element.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} begin Zero-based index at which to begin extraction.
 * @param {number} [end=Infinity] Zero-based index before which to end extraction.
 * @returns {MonoTypeOperatorFunction<TSource>} An iterable containing the extracted elements.
 */
export declare function slice<TSource>(begin: number, end?: number): MonoTypeOperatorFunction<TSource>;
