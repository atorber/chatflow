import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { buffer } from '../../asynciterable/operators/buffer';
/**
 * @ignore
 */
export function bufferProto(count, skip) {
    return buffer(count, skip)(this);
}
AsyncIterableX.prototype.buffer = bufferProto;

//# sourceMappingURL=buffer.mjs.map
