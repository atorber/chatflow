import { IterableX } from '../../iterable/iterablex';
import { count } from '../../iterable/count';
/**
 * @ignore
 */
export function countProto(options) {
    return count(this, options);
}
IterableX.prototype.count = countProto;

//# sourceMappingURL=count.mjs.map
