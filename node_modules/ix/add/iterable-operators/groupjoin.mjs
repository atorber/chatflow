import { IterableX } from '../../iterable/iterablex';
import { groupJoin } from '../../iterable/operators/groupjoin';
/**
 * @ignore
 */
export function groupJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return groupJoin(inner, outerSelector, innerSelector, resultSelector)(this);
}
IterableX.prototype.groupJoin = groupJoinProto;

//# sourceMappingURL=groupjoin.mjs.map
