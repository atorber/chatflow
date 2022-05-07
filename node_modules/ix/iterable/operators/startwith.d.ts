import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class StartWithIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _args;
    constructor(source: Iterable<TSource>, args: TSource[]);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Prepend a value to an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {...TSource[]} args Elements to prepend to the specified sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} The source sequence prepended with the specified values.
 */
export declare function startWith<TSource>(...args: TSource[]): MonoTypeOperatorFunction<TSource>;
