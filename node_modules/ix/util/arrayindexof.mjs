/**
 * @ignore
 */
export function arrayIndexOf(array, item, comparer) {
    for (let i = 0, len = array.length; i < len; i++) {
        if (comparer(item, array[i])) {
            return i;
        }
    }
    return -1;
}
/**
 * @ignore
 */
export async function arrayIndexOfAsync(array, item, comparer) {
    for (let i = 0, len = array.length; i < len; i++) {
        if (await comparer(item, array[i])) {
            return i;
        }
    }
    return -1;
}

//# sourceMappingURL=arrayindexof.mjs.map
