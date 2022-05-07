import { IterableX } from './iterablex';
export declare class OnErrorResumeNextIterable<TSource> extends IterableX<TSource> {
    private _source;
    constructor(source: Iterable<Iterable<TSource>>);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Concatenates all of the specified iterable sequences, even if the previous iterable sequence terminated exceptionally.
 *
 * @template T The type of the elements in the source sequences.
 * @param {...Iterable<T>[]} args iterable sequences to concatenate.
 * @returns {IterableX<T>} An iterable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
 */
export declare function onErrorResumeNext<T>(...source: Iterable<T>[]): IterableX<T>;
