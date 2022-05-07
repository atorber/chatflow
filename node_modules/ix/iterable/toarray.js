"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = void 0;
/**
 * Converts an existing iterable to anarray of values.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {Iterable<TSource>} source The source sequence to convert to an array.
 * @returns {TSource[]} All the items from the source sequence as an array.
 */
function toArray(source) {
    const results = [];
    for (const item of source) {
        results.push(item);
    }
    return results;
}
exports.toArray = toArray;

//# sourceMappingURL=toarray.js.map
