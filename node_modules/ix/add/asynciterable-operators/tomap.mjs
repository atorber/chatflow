import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { toMap } from '../../asynciterable/tomap';
export async function toMapProto(options) {
    return toMap(this, options);
}
AsyncIterableX.prototype.toMap = toMapProto;

//# sourceMappingURL=tomap.mjs.map
