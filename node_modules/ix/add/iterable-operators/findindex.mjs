import { IterableX } from '../../iterable/iterablex';
import { findIndex } from '../../iterable/findindex';
/**
 * @ignore
 */
export function findIndexProto(options) {
    return findIndex(this, options);
}
IterableX.prototype.findIndex = findIndexProto;

//# sourceMappingURL=findindex.mjs.map
