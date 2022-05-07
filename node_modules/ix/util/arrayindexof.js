"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayIndexOfAsync = exports.arrayIndexOf = void 0;
/**
 * @ignore
 */
function arrayIndexOf(array, item, comparer) {
    for (let i = 0, len = array.length; i < len; i++) {
        if (comparer(item, array[i])) {
            return i;
        }
    }
    return -1;
}
exports.arrayIndexOf = arrayIndexOf;
/**
 * @ignore
 */
async function arrayIndexOfAsync(array, item, comparer) {
    for (let i = 0, len = array.length; i < len; i++) {
        if (await comparer(item, array[i])) {
            return i;
        }
    }
    return -1;
}
exports.arrayIndexOfAsync = arrayIndexOfAsync;

//# sourceMappingURL=arrayindexof.js.map
