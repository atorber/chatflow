import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { maxBy } from '../../asynciterable/maxby';
/**
 * @ignore
 */
export function maxByProto(options) {
    return maxBy(this, options);
}
AsyncIterableX.prototype.maxBy = maxByProto;

//# sourceMappingURL=maxby.mjs.map
