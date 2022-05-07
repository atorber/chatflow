"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.ConcatIterable = void 0;
const iterablex_1 = require("./iterablex");
class ConcatIterable extends iterablex_1.IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        for (const outer of this._source) {
            yield* outer;
        }
    }
}
exports.ConcatIterable = ConcatIterable;
/**
 * Concatenates all iterable sequences in the given sequences, as long as the previous iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...Iterable<T>[]} args The iterable sources.
 * @returns {IterableX<T>} An iterable sequence that contains the elements of each given sequence, in sequential order.
 */
function concat(...args) {
    return new ConcatIterable(args);
}
exports.concat = concat;

//# sourceMappingURL=concat.js.map
