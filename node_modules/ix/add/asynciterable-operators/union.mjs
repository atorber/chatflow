import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { union } from '../../asynciterable/operators/union';
/**
 * @ignore
 */
export function unionProto(right, comparer) {
    return union(right, comparer)(this);
}
AsyncIterableX.prototype.union = unionProto;

//# sourceMappingURL=union.mjs.map
