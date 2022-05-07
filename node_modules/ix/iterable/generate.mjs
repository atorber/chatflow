import { IterableX } from './iterablex';
class GenerateIterable extends IterableX {
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
    *[Symbol.iterator]() {
        for (let i = this._initialState; this._condition(i); i = this._iterate(i)) {
            yield this._resultSelector(i);
        }
    }
}
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
export function generate(initialState, condition, iterate, resultSelector) {
    return new GenerateIterable(initialState, condition, iterate, resultSelector);
}

//# sourceMappingURL=generate.mjs.map
