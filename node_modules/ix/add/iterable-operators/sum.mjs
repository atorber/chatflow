import { IterableX } from '../../iterable/iterablex';
import { sum } from '../../iterable/sum';
export function sumProto(options) {
    return sum(this, options);
}
IterableX.prototype.sum = sumProto;

//# sourceMappingURL=sum.mjs.map
