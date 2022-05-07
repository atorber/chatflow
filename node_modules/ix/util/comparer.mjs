/**
 * @ignore
 */
export function comparer(x, y) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
}
/**
 * @ignore
 */
export async function comparerAsync(x, y) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
}
/**
 * @ignore
 */
export function equalityComparer(key, minValue) {
    // eslint-disable-next-line no-nested-ternary
    return key > minValue ? 1 : key < minValue ? -1 : 0;
}
/**
 * @ignore
 */
export async function equalityComparerAsync(key, minValue) {
    // eslint-disable-next-line no-nested-ternary
    return key > minValue ? 1 : key < minValue ? -1 : 0;
}

//# sourceMappingURL=comparer.mjs.map
