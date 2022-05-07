import { IterableX } from '../../iterable/iterablex';
import { toMap } from '../../iterable/tomap';
export function toMapProto(options) {
    return toMap(this, options);
}
IterableX.prototype.toMap = toMapProto;

//# sourceMappingURL=tomap.mjs.map
