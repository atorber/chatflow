import { IterableX } from '../../iterable/iterablex';
import { groupBy } from '../../iterable/operators/groupby';
import { identity } from '../../util/identity';
export function groupByProto(keySelector, elementSelector = identity) {
    return groupBy(keySelector, elementSelector)(this);
}
IterableX.prototype.groupBy = groupByProto;

//# sourceMappingURL=groupby.mjs.map
