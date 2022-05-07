/**
 * @ignore
 */
export function returnIterator(it) {
    if (typeof it.return === 'function') {
        it.return();
    }
}
/**
 * @ignore
 */
export async function returnAsyncIterator(it) {
    if (typeof it.return === 'function') {
        await it.return();
    }
}

//# sourceMappingURL=returniterator.mjs.map
