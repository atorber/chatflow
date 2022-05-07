import { IterableX } from '../../iterable/iterablex';
import { maxBy } from '../../iterable/maxby';
/**
 * @ignore
 */
export function maxByProto(options) {
    return maxBy(this, options);
}
IterableX.prototype.maxBy = maxByProto;

//# sourceMappingURL=maxby.mjs.map
