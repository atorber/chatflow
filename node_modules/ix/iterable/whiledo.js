"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whileDo = void 0;
const iterablex_1 = require("./iterablex");
class WhileIterable extends iterablex_1.IterableX {
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
function whileDo(source, condition) {
    return new WhileIterable(condition, source);
}
exports.whileDo = whileDo;

//# sourceMappingURL=whiledo.js.map
