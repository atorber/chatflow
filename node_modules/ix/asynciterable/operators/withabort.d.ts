import { AsyncIterableX } from '../asynciterablex';
import { MonoTypeOperatorAsyncFunction } from '../../interfaces';
export declare class WithAbortAsyncIterable<TSource> extends AsyncIterableX<TSource> {
    private _source;
    private _signal;
    constructor(source: AsyncIterable<TSource>, signal: AbortSignal);
    withAbort(signal: AbortSignal): WithAbortAsyncIterable<TSource>;
    [Symbol.asyncIterator](): AsyncIterator<TSource>;
}
/**
 * Wraps the existing async-iterable sequence with an abort signal for cancellation.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AbortSignal} signal The abort signal used for cancellation.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable that can be cancelled by the abort signal.
 */
export declare function withAbort<TSource>(signal: AbortSignal): MonoTypeOperatorAsyncFunction<TSource>;
/**
 * Wraps an existing async-iterable with a new async-iterable which support cancellation.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The source sequence to wrap with the abort signal.
 * @param {AbortSignal} [signal] The abort signal used for cancellation.
 * @returns {AsyncIterable<TSource>} The source sequence wrapped with an abort signal for cancellation.
 */
export declare function wrapWithAbort<TSource>(source: AsyncIterable<TSource>, signal?: AbortSignal): AsyncIterable<TSource>;
