import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { BatchAsyncIterable } from '../../asynciterable/operators/batch';
/**
 * @ignore
 */
export function batchProto() {
    return new BatchAsyncIterable(this);
}
AsyncIterableX.prototype.batch = batchProto;

//# sourceMappingURL=batch.mjs.map
