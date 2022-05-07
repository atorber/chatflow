"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.every = void 0;
/**
 * Determines whether all elements of an iterable sequence satisfy a condition.
 *
 * @template T The type of the elements in the source sequence.
 * @param {Iterable<T>} source An iterable sequence whose elements to apply the predicate to.
 * @param {FindOptions<T>} options The options for a predicate for filtering, thisArg for binding and AbortSignal for cancellation.
 * @returns {boolean} A boolean determining whether all elements in the source sequence pass the test in the specified predicate.
 */
function every(source, options) {
    const { ['thisArg']: thisArg, ['predicate']: predicate } = options;
    let i = 0;
    for (const item of source) {
        if (!predicate.call(thisArg, item, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;

//# sourceMappingURL=every.js.map
