import { IterableX } from '../../iterable/iterablex';
import { filter } from '../../iterable/operators/filter';
export function filterProto(predicate, thisArg) {
    return filter(predicate, thisArg)(this);
}
IterableX.prototype.filter = filterProto;

//# sourceMappingURL=filter.mjs.map
