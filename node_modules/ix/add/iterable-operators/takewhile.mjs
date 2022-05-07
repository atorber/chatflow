import { IterableX } from '../../iterable/iterablex';
import { takeWhile } from '../../iterable/operators/takewhile';
export function takeWhileProto(predicate) {
    return takeWhile(predicate)(this);
}
IterableX.prototype.takeWhile = takeWhileProto;

//# sourceMappingURL=takewhile.mjs.map
