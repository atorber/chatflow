import { IterableX } from '../iterablex';
import { MonoTypeOperatorFunction } from '../../interfaces';
export declare class RepeatIterable<TSource> extends IterableX<TSource> {
    private _source;
    private _count;
    constructor(source: Iterable<TSource>, count: number);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Repeats the async-enumerable sequence a specified number of times.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} [count=-1] Number of times to repeat the sequence. If not specified, the sequence repeats indefinitely.
 * @returns {MonoTypeOperatorFunction<TSource>} The iterable sequence producing the elements of the given sequence repeatedly.
 */
export declare function repeat<TSource>(count?: number): MonoTypeOperatorFunction<TSource>;
