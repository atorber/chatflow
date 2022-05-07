import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { SkipLastAsyncIterable } from '../../asynciterable/operators/skiplast';
/**
 * @ignore
 */
export function skipLastProto(count) {
    return new SkipLastAsyncIterable(this, count);
}
AsyncIterableX.prototype.skipLast = skipLastProto;

//# sourceMappingURL=skiplast.mjs.map
