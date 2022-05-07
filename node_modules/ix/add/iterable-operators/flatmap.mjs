import { IterableX } from '../../iterable/iterablex';
import { flatMap } from '../../iterable/operators/flatmap';
/**
 * @ignore
 */
export function flatMapProto(fn, thisArg) {
    return flatMap(fn, thisArg)(this);
}
IterableX.prototype.flatMap = flatMapProto;

//# sourceMappingURL=flatmap.mjs.map
