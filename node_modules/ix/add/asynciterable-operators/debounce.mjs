import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { debounce } from '../../asynciterable/operators/debounce';
/**
 * @ignore
 */
export function debounceProto(time) {
    return debounce(time)(this);
}
AsyncIterableX.prototype.debounce = debounceProto;

//# sourceMappingURL=debounce.mjs.map
