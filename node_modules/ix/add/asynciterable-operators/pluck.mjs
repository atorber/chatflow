import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { pluck } from '../../asynciterable/operators/pluck';
/**
 * @ignore
 */
export function pluckProto(...args) {
    return pluck(...args)(this);
}
AsyncIterableX.prototype.pluck = pluckProto;

//# sourceMappingURL=pluck.mjs.map
