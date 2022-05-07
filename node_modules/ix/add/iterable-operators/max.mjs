import { IterableX } from '../../iterable/iterablex';
import { max } from '../../iterable/max';
export function maxProto(options) {
    return max(this, options);
}
IterableX.prototype.max = maxProto;

//# sourceMappingURL=max.mjs.map
