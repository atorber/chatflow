"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalize = exports.FinallyIterable = void 0;
const iterablex_1 = require("../iterablex");
class FinallyIterable extends iterablex_1.IterableX {
    _source;
    _action;
    constructor(source, action) {
        super();
        this._source = source;
        this._action = action;
    }
    *[Symbol.iterator]() {
        try {
            yield* this._source;
        }
        finally {
            this._action();
        }
    }
}
exports.FinallyIterable = FinallyIterable;
/**
 *  Invokes a specified asynchronous action after the source iterable sequence terminates gracefully or exceptionally.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {(() => void)} action Action to invoke and await asynchronously after the source iterable sequence terminates
 * @returns {MonoTypeOperatorFunction<TSource>} An operator that returns the source sequence with the
 * action-invoking termination behavior applied.
 */
function finalize(action) {
    return function finallyOperatorFunction(source) {
        return new FinallyIterable(source, action);
    };
}
exports.finalize = finalize;

//# sourceMappingURL=finalize.js.map
