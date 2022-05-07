import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class ReverseIterable<TSource> extends IterableX<TSource> {
    private _source;
    constructor(source: Iterable<TSource>);
    [Symbol.iterator](): Generator<TSource, void, undefined>;
}
/**
 * Reverses the iterable instance.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The iterable in reversed sequence.
 */
export declare function reverse<TSource>(): MonoTypeOperatorFunction<TSource>;
