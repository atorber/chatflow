import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { defaultIfEmpty } from '../../asynciterable/operators/defaultifempty';
/**
 * @ignore
 */
export function defaultIfEmptyProto(defaultValue) {
    return defaultIfEmpty(defaultValue)(this);
}
AsyncIterableX.prototype.defaultIfEmpty = defaultIfEmptyProto;

//# sourceMappingURL=defaultifempty.mjs.map
