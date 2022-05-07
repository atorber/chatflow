import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { count } from '../../asynciterable/count';
/**
 * @ignore
 */
export function countProto(options) {
    return count(this, options);
}
AsyncIterableX.prototype.count = countProto;

//# sourceMappingURL=count.mjs.map
