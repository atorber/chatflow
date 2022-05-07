import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { minBy } from '../../asynciterable/minby';
/**
 * @ignore
 */
export function minByProto(options) {
    return minBy(this, options);
}
AsyncIterableX.prototype.minBy = minByProto;

//# sourceMappingURL=minby.mjs.map
