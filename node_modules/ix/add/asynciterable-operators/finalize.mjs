import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { finalize as _finalizeProto } from '../../asynciterable/operators/finalize';
/**
 * @ignore
 */
export function finalizeProto(action) {
    return _finalizeProto(action)(this);
}
AsyncIterableX.prototype.finalize = finalizeProto;

//# sourceMappingURL=finalize.mjs.map
