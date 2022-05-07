import { IterableX } from '../../iterable/iterablex';
import { union } from '../../iterable/operators/union';
/**
 * @ignore
 */
export function unionProto(right, comparer) {
    return union(right, comparer)(this);
}
IterableX.prototype.union = unionProto;

//# sourceMappingURL=union.mjs.map
