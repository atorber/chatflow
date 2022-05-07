"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrouping = void 0;
/**
 * @ignore
 */
function createGrouping(source, keySelector, elementSelector) {
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
exports.createGrouping = createGrouping;

//# sourceMappingURL=_grouping.js.map
