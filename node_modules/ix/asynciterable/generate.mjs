import { AsyncIterableX } from './asynciterablex';
import { throwIfAborted } from '../aborterror';
class GenerateAsyncIterable extends AsyncIterableX {
    _initialState;
    _condition;
    _iterate;
    _resultSelector;
    constructor(initialState, condition, iterate, resultSelector) {
        super();
        this._initialState = initialState;
        this._condition = condition;
        this._iterate = iterate;
        this._resultSelector = resultSelector;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for (let i = this._initialState; await this._condition(i, signal); i = await this._iterate(i, signal)) {
            yield await this._resultSelector(i, signal);
        }
    }
}
/**
 * Generates an async-iterable sequence by running a state-driven loop producing the sequence's elements.
 *
 * @template TState The type of the state used in the generator loop.
 * @template TResult The type of the elements in the produced sequence.
 * @param {TState} initialState The initial state.
 * @param {((value: TState, signal?: AbortSignal) => boolean | Promise<boolean>)} condition Condition to terminate generation (upon returning false).
 * @param {((value: TState, signal?: AbortSignal) => TState | Promise<TState>)} iterate Iteration step function.
 * @param {((value: TState, signal?: AbortSignal) => TResult | Promise<TResult>)} resultSelector Selector function for results produced in
 * the sequence.
 * @returns {AsyncIterableX<TResult>} The generated async-iterable sequence.
 */
export function generate(initialState, condition, iterate, resultSelector) {
    return new GenerateAsyncIterable(initialState, condition, iterate, resultSelector);
}

//# sourceMappingURL=generate.mjs.map
