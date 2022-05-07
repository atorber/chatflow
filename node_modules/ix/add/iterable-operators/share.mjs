import { IterableX } from '../../iterable/iterablex';
import { share } from '../../iterable/operators/share';
/**
 * @ignore
 */
export function shareProto(fn) {
    return share(fn)(this);
}
IterableX.prototype.share = shareProto;

//# sourceMappingURL=share.mjs.map
