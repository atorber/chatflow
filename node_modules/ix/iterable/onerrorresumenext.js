"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onErrorResumeNext = exports.OnErrorResumeNextIterable = void 0;
const iterablex_1 = require("./iterablex");
class OnErrorResumeNextIterable extends iterablex_1.IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        for (const item of this._source) {
            const it = item[Symbol.iterator]();
            while (1) {
                let next;
                try {
                    next = it.next();
                }
                catch (e) {
                    break;
                }
                if (next.done) {
                    break;
                }
                yield next.value;
            }
        }
    }
}
exports.OnErrorResumeNextIterable = OnErrorResumeNextIterable;
/**
 * Concatenates all of the specified iterable sequences, even if the previous iterable sequence terminated exceptionally.
 *
 * @template T The type of the elements in the source sequences.
 * @param {...Iterable<T>[]} args iterable sequences to concatenate.
 * @returns {IterableX<T>} An iterable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
 */
function onErrorResumeNext(...source) {
    return new OnErrorResumeNextIterable(source);
}
exports.onErrorResumeNext = onErrorResumeNext;

//# sourceMappingURL=onerrorresumenext.js.map
