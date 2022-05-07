import { IterableX } from '../../iterable/iterablex';
import { minBy } from '../../iterable/minby';
/**
 * @ignore
 */
export function minByProto(options) {
    return minBy(this, options);
}
IterableX.prototype.minBy = minByProto;

//# sourceMappingURL=minby.mjs.map
