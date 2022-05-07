import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class EndWithIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _args;
    constructor(source: Iterable<TSource>, args: TSource[]);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Append values to an iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {...TSource[]} args The values to append to the end of the iterable sequence.
 * @returns {MonoTypeOperatorFunction<TSource>} An operator which appends values to the end of the sequence.
 */
export declare function endWith<TSource>(...args: TSource[]): MonoTypeOperatorFunction<TSource>;
