import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { SliceAsyncIterable } from '../../asynciterable/operators/slice';
/**
 * @ignore
 */
export function sliceProto(begin, end) {
    return new SliceAsyncIterable(this, begin, end);
}
AsyncIterableX.prototype.slice = sliceProto;

//# sourceMappingURL=slice.mjs.map
