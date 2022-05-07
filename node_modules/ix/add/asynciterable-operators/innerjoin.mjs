import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { JoinAsyncIterable } from '../../asynciterable/operators/innerjoin';
/**
 * @ignore
 */
export function innerJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return new JoinAsyncIterable(this, inner, outerSelector, innerSelector, resultSelector);
}
AsyncIterableX.prototype.innerJoin = innerJoinProto;

//# sourceMappingURL=innerjoin.mjs.map
