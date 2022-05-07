"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAsyncIterator = exports.returnIterator = void 0;
/**
 * @ignore
 */
function returnIterator(it) {
    if (typeof it.return === 'function') {
        it.return();
    }
}
exports.returnIterator = returnIterator;
/**
 * @ignore
 */
async function returnAsyncIterator(it) {
    if (typeof it.return === 'function') {
        await it.return();
    }
}
exports.returnAsyncIterator = returnAsyncIterator;

//# sourceMappingURL=returniterator.js.map
