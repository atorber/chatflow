import { IterableX } from '../../iterable/iterablex';
import { map } from '../../iterable/operators/map';
/**
 * @ignore
 */
export function mapProto(fn, thisArg) {
    return map(fn, thisArg)(this);
}
IterableX.prototype.map = mapProto;

//# sourceMappingURL=map.mjs.map
