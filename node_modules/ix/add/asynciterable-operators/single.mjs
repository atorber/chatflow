import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { single } from '../../asynciterable/single';
/**
 * @ignore
 */
export function singleProto(options) {
    return single(this, options);
}
AsyncIterableX.prototype.single = singleProto;

//# sourceMappingURL=single.mjs.map
