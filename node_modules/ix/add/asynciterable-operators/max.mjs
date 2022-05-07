import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { max } from '../../asynciterable/max';
export async function maxProto(options) {
    return max(this, options);
}
AsyncIterableX.prototype.max = maxProto;

//# sourceMappingURL=max.mjs.map
