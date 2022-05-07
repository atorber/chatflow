import { AsyncIterableX } from '../asynciterablex';
import { MonoTypeOperatorAsyncFunction } from '../../interfaces';
export declare class IgnoreElementsAsyncIterable<TSource> extends AsyncIterableX<TSource> {
    private _source;
    constructor(source: AsyncIterable<TSource>);
    [Symbol.asyncIterator](signal?: AbortSignal): AsyncIterator<TSource>;
}
/**
 * Ignores all elements in an async-iterable sequence leaving only the termination messages.
 *
 * @template TSource The type of the elements in the source sequence
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that returns an empty async-iterable sequence
 * that signals termination, successful or exceptional, of the source sequence.
 */
export declare function ignoreElements<TSource>(): MonoTypeOperatorAsyncFunction<TSource>;
