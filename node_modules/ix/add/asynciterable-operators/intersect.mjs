import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { intersect } from '../../asynciterable/operators/intersect';
/**
 * @ignore
 */
export function intersectProto(second, comparer) {
    return intersect(second, comparer)(this);
}
AsyncIterableX.prototype.intersect = intersectProto;

//# sourceMappingURL=intersect.mjs.map
