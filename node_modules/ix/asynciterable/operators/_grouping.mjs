import { wrapWithAbort } from './withabort';
/**
 * @ignore
 */
export async function createGrouping(source, keySelector, elementSelector, signal) {
    const map = new Map();
    for await (const item of wrapWithAbort(source, signal)) {
        const key = await keySelector(item, signal);
        let grouping = map.get(key);
        if (!map.has(key)) {
            grouping = [];
            map.set(key, grouping);
        }
        const element = await elementSelector(item, signal);
        grouping.push(element);
    }
    return map;
}

//# sourceMappingURL=_grouping.mjs.map
