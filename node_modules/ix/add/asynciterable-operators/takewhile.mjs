import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { takeWhile } from '../../asynciterable/operators/takewhile';
export function takeWhileProto(predicate) {
    return takeWhile(predicate)(this);
}
AsyncIterableX.prototype.takeWhile = takeWhileProto;

//# sourceMappingURL=takewhile.mjs.map
