import { IterableX } from './iterablex';
class WhileIterable extends IterableX {
    _condition;
    _source;
    constructor(condition, source) {
        super();
        this._condition = condition;
        this._source = source;
    }
    *[Symbol.iterator]() {
        while (this._condition()) {
            yield* this._source;
        }
    }
}
/**
 * Repeats the given source as long as the specified conditions holds, where
 * the condition is evaluated before each repeated source is iterated.
 *
 * @template TSource
 * @param {Iterable<TSource>} source Source to repeat as long as the condition function evaluates to true.
 * @param {((signal?: AbortSignal) => boolean)} condition Condition that will be evaluated before the source sequence is iterated.
 * @returns {IterableX<TSource>} An iterable which is repeated while the condition returns true.
 */
export function whileDo(source, condition) {
    return new WhileIterable(condition, source);
}

//# sourceMappingURL=whiledo.mjs.map
