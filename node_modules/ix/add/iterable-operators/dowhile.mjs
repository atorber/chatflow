import { IterableX } from '../../iterable/iterablex';
import { doWhile } from '../../iterable/operators/dowhile';
/**
 * @ignore
 */
export function doWhileProto(condition) {
    return doWhile(condition)(this);
}
IterableX.prototype.doWhile = doWhileProto;

//# sourceMappingURL=dowhile.mjs.map
