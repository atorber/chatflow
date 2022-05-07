/**
 * Determines whether the given async-iterable is empty.
 *
 * @template T The type of elements in the source sequence.
 * @param {Iterable<T>} source The source async-iterable to determine whether it is empty.
 * @returns {boolean} Returns true if the sequence is empty, otherwise false.
 */
export function isEmpty(source) {
    for (const _ of source) {
        return false;
    }
    return true;
}

//# sourceMappingURL=isempty.mjs.map
