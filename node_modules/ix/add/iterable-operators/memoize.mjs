import { IterableX } from '../../iterable/iterablex';
import { memoize } from '../../iterable/operators/memoize';
/**
 * @ignore
 */
export function memoizeProto(readerCount = -1, selector) {
    return memoize(readerCount, selector)(this);
}
IterableX.prototype.memoize = memoizeProto;

//# sourceMappingURL=memoize.mjs.map
