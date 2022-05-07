import { IterableX } from '../../iterable/iterablex';
import { orderBy, orderByDescending } from '../../iterable/operators/orderby';
/**
 * @ignore
 */
export function orderByProto(keySelector, comparer) {
    return orderBy(keySelector, comparer)(this);
}
/**
 * @ignore
 */
export function orderByDescendingProto(keySelector, comparer) {
    return orderByDescending(keySelector, comparer)(this);
}
IterableX.prototype.orderBy = orderByProto;
IterableX.prototype.orderByDescending = orderByDescendingProto;

//# sourceMappingURL=orderby.mjs.map
