"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequenceEqual = void 0;
const comparer_1 = require("../util/comparer");
/**
 * Determines whether two sequences are equal by comparing the elements pairwise.
 *
 * @template T The type of the elements in the source sequence.
 * @param {Iterable<T>} source First iterable sequence to compare.
 * @param {Iterable<T>} other Second iterable sequence to compare.
 * @param {SequencEqualOptions<T>} [options] The sequence equal options which include an optional comparer and optional abort signal.
 * @returns {boolean} A promise which indicates whether both sequences are of equal length and their
 * corresponding elements are equal.
 */
function sequenceEqual(source, other, options) {
    const { ['comparer']: comparer = comparer_1.comparer } = options || {};
    const it1 = source[Symbol.iterator]();
    const it2 = other[Symbol.iterator]();
    let next1;
    let next2;
    while (!(next1 = it1.next()).done) {
        if (!(!(next2 = it2.next()).done && comparer(next1.value, next2.value))) {
            return false;
        }
    }
    return !!it2.next().done;
}
exports.sequenceEqual = sequenceEqual;

//# sourceMappingURL=sequenceequal.js.map
