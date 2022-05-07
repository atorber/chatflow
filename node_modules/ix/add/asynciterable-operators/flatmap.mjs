import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { flatMap } from '../../asynciterable/operators/flatmap';
/**
 * @ignore
 */
export function flatMapProto(selector, thisArg) {
    return flatMap(selector, thisArg)(this);
}
AsyncIterableX.prototype.flatMap = flatMapProto;

//# sourceMappingURL=flatmap.mjs.map
