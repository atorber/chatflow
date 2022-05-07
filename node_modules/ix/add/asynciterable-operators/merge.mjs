import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { merge } from '../../asynciterable/merge';
/**
 * @ignore
 */
export function mergeProto(...args) {
    return merge(this, ...args);
}
AsyncIterableX.prototype.merge = mergeProto;

//# sourceMappingURL=merge.mjs.map
