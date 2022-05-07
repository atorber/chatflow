import { IterableX } from '../../iterable/iterablex';
import { innerJoin } from '../../iterable/operators/innerjoin';
/**
 * @ignore
 */
export function innerJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return innerJoin(inner, outerSelector, innerSelector, resultSelector)(this);
}
IterableX.prototype.innerJoin = innerJoinProto;

//# sourceMappingURL=innerjoin.mjs.map
