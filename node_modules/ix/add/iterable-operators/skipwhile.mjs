import { IterableX } from '../../iterable/iterablex';
import { skipWhile } from '../../iterable/operators/skipwhile';
export function skipWhileProto(predicate) {
    return skipWhile(predicate)(this);
}
IterableX.prototype.skipWhile = skipWhileProto;

//# sourceMappingURL=skipwhile.mjs.map
