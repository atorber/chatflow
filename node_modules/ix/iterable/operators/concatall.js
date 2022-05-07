"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatAll = void 0;
const concat_1 = require("../concat");
/**
 * Concatenates all inner iterable sequences, as long as the previous
 * iterable sequence terminated successfully.
 *
 * @template T The type of elements in the source sequence.
 * @returns {OperatorFunction<Iterable<T>, T>} An operator which concatenates all inner iterable sources.
 */
function concatAll() {
    return function concatAllOperatorFunction(source) {
        return new concat_1.ConcatIterable(source);
    };
}
exports.concatAll = concatAll;

//# sourceMappingURL=concatall.js.map
