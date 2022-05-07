"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapWithAbort = exports.withAbort = exports.WithAbortAsyncIterable = void 0;
const asynciterablex_1 = require("../asynciterablex");
class WithAbortAsyncIterable extends asynciterablex_1.AsyncIterableX {
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
exports.WithAbortAsyncIterable = WithAbortAsyncIterable;
/**
 * Wraps the existing async-iterable sequence with an abort signal for cancellation.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AbortSignal} signal The abort signal used for cancellation.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable that can be cancelled by the abort signal.
 */
function withAbort(signal) {
    return function withAbortOperatorFunction(source) {
        return new WithAbortAsyncIterable(source, signal);
    };
}
exports.withAbort = withAbort;
/**
 * Wraps an existing async-iterable with a new async-iterable which support cancellation.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The source sequence to wrap with the abort signal.
 * @param {AbortSignal} [signal] The abort signal used for cancellation.
 * @returns {AsyncIterable<TSource>} The source sequence wrapped with an abort signal for cancellation.
 */
function wrapWithAbort(source, signal) {
    return signal ? new WithAbortAsyncIterable(source, signal) : source;
}
exports.wrapWithAbort = wrapWithAbort;

//# sourceMappingURL=withabort.js.map
