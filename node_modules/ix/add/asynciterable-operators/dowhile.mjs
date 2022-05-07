import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { doWhile } from '../../asynciterable/operators/dowhile';
/**
 * @ignore
 */
export function doWhileProto(condition) {
    return doWhile(condition)(this);
}
AsyncIterableX.prototype.doWhile = doWhileProto;

//# sourceMappingURL=dowhile.mjs.map
