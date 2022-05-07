"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = void 0;
/**
 * Determines whether the given async-iterable is empty.
 *
 * @template T The type of elements in the source sequence.
 * @param {Iterable<T>} source The source async-iterable to determine whether it is empty.
 * @returns {boolean} Returns true if the sequence is empty, otherwise false.
 */
function isEmpty(source) {
    for (const _ of source) {
        return false;
    }
    return true;
}
exports.isEmpty = isEmpty;

//# sourceMappingURL=isempty.js.map
