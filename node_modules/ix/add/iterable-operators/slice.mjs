import { IterableX } from '../../iterable/iterablex';
import { slice } from '../../iterable/operators/slice';
/**
 * @ignore
 */
export function sliceProto(begin, end) {
    return slice(begin, end)(this);
}
IterableX.prototype.slice = sliceProto;

//# sourceMappingURL=slice.mjs.map
