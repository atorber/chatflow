import { IterableX } from '../../iterable/iterablex';
import { pluck } from '../../iterable/operators/pluck';
/**
 * @ignore
 */
export function pluckProto(...args) {
    return pluck(...args)(this);
}
IterableX.prototype.pluck = pluckProto;

//# sourceMappingURL=pluck.mjs.map
