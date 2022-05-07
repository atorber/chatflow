import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ConcatAllAsyncIterable } from '../../asynciterable/operators/concatall';
/**
 * @ignore
 */
export function concatAllProto() {
    return new ConcatAllAsyncIterable(this);
}
AsyncIterableX.prototype.concatAll = concatAllProto;

//# sourceMappingURL=concatall.mjs.map
