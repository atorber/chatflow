import { IterableX } from '../../iterable/iterablex';
import { buffer } from '../../iterable/operators/buffer';
/**
 * @ignore
 */
export function bufferProto(count, skip) {
    return buffer(count, skip)(this);
}
IterableX.prototype.buffer = bufferProto;

//# sourceMappingURL=buffer.mjs.map
