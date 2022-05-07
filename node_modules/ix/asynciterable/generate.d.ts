import { AsyncIterableX } from './asynciterablex';
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
export declare function generate<TState, TResult>(initialState: TState, condition: (value: TState, signal?: AbortSignal) => boolean | Promise<boolean>, iterate: (value: TState, signal?: AbortSignal) => TState | Promise<TState>, resultSelector: (value: TState, signal?: AbortSignal) => TResult | Promise<TResult>): AsyncIterableX<TResult>;
