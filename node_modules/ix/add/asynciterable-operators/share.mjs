import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { share } from '../../asynciterable/operators/share';
/**
 * @ignore
 */
export function shareProto(selector) {
    return share(selector)(this);
}
AsyncIterableX.prototype.share = shareProto;

//# sourceMappingURL=share.mjs.map
