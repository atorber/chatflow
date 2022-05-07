import { MonoTypeOperatorAsyncFunction } from '../../interfaces';
/**
 * Propagates the async sequence that reacts first.
 *
 * @param {...AsyncIterable<T>[]} sources The source sequences.
 * @return {MonoTypeOperatorAsyncFunction<TSource> } An async sequence that surfaces either of the given sequences, whichever reacted first.
 */
export declare function raceWith<TSource>(...sources: AsyncIterable<TSource>[]): MonoTypeOperatorAsyncFunction<TSource>;
