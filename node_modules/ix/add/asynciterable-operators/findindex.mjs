import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { findIndex } from '../../asynciterable/findindex';
/**
 * @ignore
 */
export function findIndexProto(options) {
    return findIndex(this, options);
}
AsyncIterableX.prototype.findIndex = findIndexProto;

//# sourceMappingURL=findindex.mjs.map
