"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndex = void 0;
/**
 * Returns the index of the first element in the array that satisfies the provided testing function.
 * Otherwise, it returns -1, indicating that no element passed the test.
 *
 * @template T The type of the elements in the source sequence.
 * @param {Iterable<T>} source An iterable sequence whose elements to apply the predicate to.
 * @param {FindOptions<T>} options The options for a predicate for filtering, thisArg for binding and AbortSignal for cancellation.
 * @returns {number} The index of the first element in the array that passes the test. Otherwise, -1.
 */
function findIndex(source, options) {
    const { ['thisArg']: thisArg, ['predicate']: predicate } = options;
    let i = 0;
    for (const item of source) {
        if (predicate.call(thisArg, item, i++)) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;

//# sourceMappingURL=findindex.js.map
