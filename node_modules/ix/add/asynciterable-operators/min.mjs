import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { min } from '../../asynciterable/min';
export function minProto(options) {
    return min(this, options);
}
AsyncIterableX.prototype.min = minProto;

//# sourceMappingURL=min.mjs.map
