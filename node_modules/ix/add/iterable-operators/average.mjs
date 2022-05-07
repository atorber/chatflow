import { IterableX } from '../../iterable/iterablex';
import { average } from '../../iterable/average';
export function averageProto(options) {
    return average(this, options);
}
IterableX.prototype.average = averageProto;

//# sourceMappingURL=average.mjs.map
