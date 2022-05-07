import { IterableX } from '../../iterable/iterablex';
import { concatAll } from '../../iterable/operators/concatall';
/**
 * @ignore
 */
export function concatAllProto() {
    return concatAll()(this);
}
IterableX.prototype.concatAll = concatAllProto;

//# sourceMappingURL=concatall.mjs.map
