import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { toSet } from '../../asynciterable/toset';
/**
 * @ignore
 */
export function toSetProto() {
    return toSet(this);
}
AsyncIterableX.prototype.toSet = toSetProto;

//# sourceMappingURL=toset.mjs.map
