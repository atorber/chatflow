import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { catchError as _catchError } from '../../asynciterable/operators/catcherror';
/**
 * @ignore
 */
export function catchProto(handler) {
    return _catchError(handler)(this);
}
AsyncIterableX.prototype.catchError = catchProto;

//# sourceMappingURL=catcherror.mjs.map
