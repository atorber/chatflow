import { IterableX } from '../../iterable/iterablex';
import { catchError } from '../../iterable/operators/catcherror';
/**
 * @ignore
 */
export function catchErrorProto(fn) {
    return catchError(fn)(this);
}
IterableX.prototype.catchError = catchErrorProto;

//# sourceMappingURL=catcherror.mjs.map
