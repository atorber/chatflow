export function extremaBy(source, selector, comparer) {
    let result = [];
    const it = source[Symbol.iterator]();
    const { value, done } = it.next();
    if (done) {
        throw new Error('Sequence contains no elements');
    }
    let resKey = selector(value);
    result.push(value);
    let next;
    while (!(next = it.next()).done) {
        const current = next.value;
        const key = selector(current);
        const cmp = comparer(key, resKey);
        if (cmp === 0) {
            result.push(current);
        }
        else if (cmp > 0) {
            result = [current];
            resKey = key;
        }
    }
    return result;
}

//# sourceMappingURL=_extremaby.mjs.map
