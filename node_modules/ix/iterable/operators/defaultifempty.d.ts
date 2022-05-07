import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class DefaultIfEmptyIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _defaultValue;
    constructor(source: Iterable<TSource>, defaultValue: TSource);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Returns the elements of the specified sequence or the default value in a singleton sequence
 * if the sequence is empty.
 *
 * @template T The type of elements in the source sequence.
 * @param {T} defaultValue The value to return if the sequence is empty.
 * @returns {MonoTypeOperatorFunction<T>} An operator which returns the elements of the source sequence or the default value as a singleton.
 */
export declare function defaultIfEmpty<T>(defaultValue: T): MonoTypeOperatorFunction<T>;
