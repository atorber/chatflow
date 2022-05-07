"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.min = void 0;
const comparer_1 = require("../util/comparer");
const identity_1 = require("../util/identity");
/**
 *  * Returns the minimum element with the optional selector.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {Iterable<TSource>} source An iterable sequence to determine the minimum element of.
 * @param {ExtremaByOptions<TKey>} [options] The options which include an optional comparer.
 * @returns {TResult} The minimum element.
 */
function min(source, options) {
    const { ['comparer']: comparer = comparer_1.equalityComparer, ['selector']: selector = identity_1.identity } = options || {};
    const it = source[Symbol.iterator]();
    let next = it.next();
    if (next.done) {
        throw new Error('Sequence contains no elements');
    }
    let minValue = selector(next.value);
    while (!(next = it.next()).done) {
        const current = selector(next.value);
        if (comparer(current, minValue) < 0) {
            minValue = current;
        }
    }
    return minValue;
}
exports.min = min;

//# sourceMappingURL=min.js.map
