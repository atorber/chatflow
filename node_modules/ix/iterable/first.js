"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
/**
 * Returns the first element of an iterable sequence that matches the predicate if provided, or undefined if no such element exists.
 *
 * @template T The type of the elements in the source sequence.
 * @param {Iterable<T>} source Source async-enumerable sequence.
 * @returns {(S | undefined)} The first element in the iterable sequence, or undefined if no such element exists.
 */
function first(source, options) {
    const { ['thisArg']: thisArg, ['predicate']: predicate = () => true } = options || {};
    let i = 0;
    for (const item of source) {
        if (predicate.call(thisArg, item, i++)) {
            return item;
        }
    }
    return undefined;
}
exports.first = first;

//# sourceMappingURL=first.js.map
