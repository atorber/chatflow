"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.max = void 0;
const comparer_1 = require("../util/comparer");
const identity_1 = require("../util/identity");
/**
 * Returns the maximum element with the optional selector.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {Iterable<TSource>} source An async-iterable sequence to determine the maximum element of.
 * @param {ExtremaByOptions<TKey>} [options] The options which include an optional comparer and abort signal.
 * @returns {Promise<TResult>} The maximum element.
 */
function max(source, options) {
    const { ['comparer']: comparer = comparer_1.equalityComparer, ['selector']: selector = identity_1.identity } = options || {};
    const it = source[Symbol.iterator]();
    let next = it.next();
    if (next.done) {
        throw new Error('Sequence contains no elements');
    }
    let maxValue = selector(next.value);
    while (!(next = it.next()).done) {
        const current = selector(next.value);
        if (comparer(current, maxValue) > 0) {
            maxValue = current;
        }
    }
    return maxValue;
}
exports.max = max;

//# sourceMappingURL=max.js.map
