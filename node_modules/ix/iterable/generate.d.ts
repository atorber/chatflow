import { IterableX } from './iterablex';
/**
 * Generates an iterable sequence by running a state-driven loop producing the sequence's elements.
 *
 * @template TState The type of the state used in the generator loop.
 * @template TResult The type of the elements in the produced sequence.
 * @param {TState} initialState The initial state.
 * @param {((value: TState) => boolean)} condition Condition to terminate generation (upon returning false).
 * @param {((value: TState) => TState)} iterate Iteration step function.
 * @param {((value: TState) => TResult)} resultSelector Selector function for results produced in
 * the sequence.
 * @returns {IterableX<TResult>} The generated iterable sequence.
 */
export declare function generate<TState, TResult>(initialState: TState, condition: (value: TState) => boolean, iterate: (value: TState) => TState, resultSelector: (value: TState) => TResult): IterableX<TResult>;
