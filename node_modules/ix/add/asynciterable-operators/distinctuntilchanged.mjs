import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { distinctUntilChanged } from '../../asynciterable/operators/distinctuntilchanged';
/**
 * @ignore
 */
export function distinctUntilChangedProto(options) {
    return distinctUntilChanged(options)(this);
}
AsyncIterableX.prototype.distinctUntilChanged = distinctUntilChangedProto;

//# sourceMappingURL=distinctuntilchanged.mjs.map
