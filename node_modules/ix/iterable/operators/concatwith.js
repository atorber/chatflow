"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatWith = void 0;
const concat_1 = require("../concat");
/**
 * Concatenates all iterable sequences in the given sequences, as long as the previous iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...Iterable<T>[]} args The iterable sources.
 * @returns {AsyncIterableX<T>} An iterable sequence that contains the elements of each given sequence, in sequential order.
 */
function concatWith(...args) {
    return function concatWithOperatorFunction(source) {
        return new concat_1.ConcatIterable([source, ...args]);
    };
}
exports.concatWith = concatWith;

//# sourceMappingURL=concatwith.js.map
