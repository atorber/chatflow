import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { mergeAll } from '../../asynciterable/operators/mergeall';
/**
 * @ignore
 */
export function mergeAllProto() {
    return mergeAll()(this);
}
AsyncIterableX.prototype.mergeAll = mergeAllProto;

//# sourceMappingURL=mergeall.mjs.map
