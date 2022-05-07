import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { GroupJoinAsyncIterable } from '../../asynciterable/operators/groupjoin';
/**
 * @ignore
 */
export function groupJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return new GroupJoinAsyncIterable(this, inner, outerSelector, innerSelector, resultSelector);
}
AsyncIterableX.prototype.groupJoin = groupJoinProto;

//# sourceMappingURL=groupjoin.mjs.map
