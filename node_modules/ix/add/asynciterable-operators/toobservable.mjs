import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { toObservable } from '../../asynciterable/toobservable';
/**
 * @ignore
 */
export function toObservableProto() {
    return toObservable(this);
}
AsyncIterableX.prototype.toObservable = toObservableProto;

//# sourceMappingURL=toobservable.mjs.map
