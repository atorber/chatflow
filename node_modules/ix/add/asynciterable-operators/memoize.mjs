import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { memoize } from '../../asynciterable/operators/memoize';
/**
 * @ignore
 */
export function memoizeProto(readerCount = -1, selector) {
    return memoize(readerCount, selector)(this);
}
AsyncIterableX.prototype.memoize = memoizeProto;

//# sourceMappingURL=memoize.mjs.map
