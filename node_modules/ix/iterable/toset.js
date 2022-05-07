"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSet = void 0;
/**
 * Converts the existing iterable into a promise which resolves a Set.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {Iterable<TSource>} source The iterable to convert into a set.
 * @returns {Set<TSource>} A promise which contains a Set with all the elements from the iterable.
 */
function toSet(source) {
    const set = new Set();
    for (const item of source) {
        set.add(item);
    }
    return set;
}
exports.toSet = toSet;

//# sourceMappingURL=toset.js.map
