import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { tap } from '../../asynciterable/operators/tap';
/** @ignore */
export function tapProto(observerOrNext, error, complete) {
    return tap(observerOrNext, error, complete)(this);
}
AsyncIterableX.prototype.tap = tapProto;

//# sourceMappingURL=tap.mjs.map
