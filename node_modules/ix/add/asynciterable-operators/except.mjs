import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { except } from '../../asynciterable/operators/except';
/**
 * @ignore
 */
export function exceptProto(second, comparer) {
    return except(second, comparer)(this);
}
AsyncIterableX.prototype.except = exceptProto;

//# sourceMappingURL=except.mjs.map
