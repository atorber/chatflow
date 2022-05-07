import { AsyncIterableX } from '../asynciterablex';
export class WithAbortAsyncIterable extends AsyncIterableX {
    _source;
    _signal;
    constructor(source, signal) {
        super();
        this._source = source;
        this._signal = signal;
    }
    withAbort(signal) {
        return new WithAbortAsyncIterable(this._source, signal);
    }
    [Symbol.asyncIterator]() {
        return this._source[Symbol.asyncIterator](this._signal);
    }
}
/**
 * Wraps the existing async-iterable sequence with an abort signal for cancellation.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AbortSignal} signal The abort signal used for cancellation.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable that can be cancelled by the abort signal.
 */
export function withAbort(signal) {
    return function withAbortOperatorFunction(source) {
        return new WithAbortAsyncIterable(source, signal);
    };
}
/**
 * Wraps an existing async-iterable with a new async-iterable which support cancellation.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The source sequence to wrap with the abort signal.
 * @param {AbortSignal} [signal] The abort signal used for cancellation.
 * @returns {AsyncIterable<TSource>} The source sequence wrapped with an abort signal for cancellation.
 */
export function wrapWithAbort(source, signal) {
    return signal ? new WithAbortAsyncIterable(source, signal) : source;
}

//# sourceMappingURL=withabort.mjs.map
