import { IterableX } from '../../iterable/iterablex';
import { skipLast } from '../../iterable/operators/skiplast';
/**
 * @ignore
 */
export function skipLastProto(count) {
    return skipLast(count)(this);
}
IterableX.prototype.skipLast = skipLastProto;

//# sourceMappingURL=skiplast.mjs.map
