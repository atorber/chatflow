import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { distinct } from '../../asynciterable/operators/distinct';
/**
 * @ignore
 */
export function distinctProto(options) {
    return distinct(options)(this);
}
AsyncIterableX.prototype.distinct = distinctProto;

//# sourceMappingURL=distinct.mjs.map
