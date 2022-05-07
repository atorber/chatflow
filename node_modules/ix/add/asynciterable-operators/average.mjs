import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { average } from '../../asynciterable/average';
export function averageProto(options) {
    return average(this, options);
}
AsyncIterableX.prototype.average = averageProto;

//# sourceMappingURL=average.mjs.map
