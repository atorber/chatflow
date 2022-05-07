import { IterableX } from '../../iterable/iterablex';
import { intersect } from '../../iterable/operators/intersect';
/**
 * @ignore
 */
export function intersectProto(second, comparer) {
    return intersect(second, comparer)(this);
}
IterableX.prototype.intersect = intersectProto;

//# sourceMappingURL=intersect.mjs.map
