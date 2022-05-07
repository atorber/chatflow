import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { sum } from '../../asynciterable/sum';
export function sumProto(options) {
    return sum(this, options);
}
AsyncIterableX.prototype.sum = sumProto;

//# sourceMappingURL=sum.mjs.map
