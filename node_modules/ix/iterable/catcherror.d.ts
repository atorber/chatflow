import { IterableX } from './iterablex';
export declare class CatchIterable<TSource> extends IterableX<TSource> {
    private _source;
    constructor(source: Iterable<Iterable<TSource>>);
    [Symbol.iterator](): Generator<TSource, void, unknown>;
}
/**
 * Creates a sequence by concatenating source sequences until a source sequence completes successfully.
 * @param {Iterable<Iterable<TSource>>} source Source sequences.
 * @return {Iterable<TSource>} Sequence that continues to concatenate source sequences while errors occur.
 */
export declare function catchAll<TSource>(source: Iterable<Iterable<TSource>>): IterableX<TSource>;
/**
 * Creates a sequence by concatenating source sequences until a source sequence completes successfully.
 * @param {...Iterable<TSource>} source Sequence that continues to concatenate source sequences while errors occur.
 * @return {Iterable<TSource>} Sequence that continues to concatenate source sequences while errors occur.
 */
export declare function catchError<TSource>(...source: Iterable<TSource>[]): IterableX<TSource>;
