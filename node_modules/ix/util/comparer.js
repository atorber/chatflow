"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equalityComparerAsync = exports.equalityComparer = exports.comparerAsync = exports.comparer = void 0;
/**
 * @ignore
 */
function comparer(x, y) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
}
exports.comparer = comparer;
/**
 * @ignore
 */
async function comparerAsync(x, y) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
}
exports.comparerAsync = comparerAsync;
/**
 * @ignore
 */
function equalityComparer(key, minValue) {
    // eslint-disable-next-line no-nested-ternary
    return key > minValue ? 1 : key < minValue ? -1 : 0;
}
exports.equalityComparer = equalityComparer;
/**
 * @ignore
 */
async function equalityComparerAsync(key, minValue) {
    // eslint-disable-next-line no-nested-ternary
    return key > minValue ? 1 : key < minValue ? -1 : 0;
}
exports.equalityComparerAsync = equalityComparerAsync;

//# sourceMappingURL=comparer.js.map
