import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class FlattenIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _depth;
    constructor(source: Iterable<TSource>, depth: number);
    private _flatten;
    [Symbol.iterator](): Iterator<TSource, any, undefined>;
}
/**
 * Flattens the nested iterable by the given depth.
 *
 * @template T The type of elements in the source sequence.
 * @param {number} [depth=Infinity] The depth to flatten the iterable sequence if specified, otherwise infinite.
 * @returns {MonoTypeOperatorFunction<T>} An operator that flattens the iterable sequence.
 */
export declare function flat<T>(depth?: number): MonoTypeOperatorFunction<T>;
