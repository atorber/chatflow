"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatWith = void 0;
const concat_1 = require("../concat");
/**
 * Concatenates all async-iterable sequences in the given sequences, as long as the previous async-iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...AsyncIterable<T>[]} args The async-iterable sources.
 * @returns {AsyncIterableX<T>} An async-iterable sequence that contains the elements of each given sequence, in sequential order.
 */
function concatWith(...args) {
    return function concatWithOperatorFunction(source) {
        return new concat_1.ConcatAsyncIterable([source, ...args]);
    };
}
exports.concatWith = concatWith;

//# sourceMappingURL=concatwith.js.map
