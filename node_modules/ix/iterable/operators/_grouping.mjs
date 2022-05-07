/**
 * @ignore
 */
export function createGrouping(source, keySelector, elementSelector) {
    const map = new Map();
    for (const item of source) {
        const key = keySelector(item);
        let grouping = map.get(key);
        if (!map.has(key)) {
            grouping = [];
            map.set(key, grouping);
        }
        grouping.push(elementSelector(item));
    }
    return map;
}

//# sourceMappingURL=_grouping.mjs.map
