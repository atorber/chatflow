import { IterableX } from '../../iterable/iterablex';
import { tap } from '../../iterable/operators/tap';
export function tapProto(observerOrNext, error, complete) {
    return tap(observerOrNext, error, complete)(this);
}
IterableX.prototype.tap = tapProto;

//# sourceMappingURL=tap.mjs.map
