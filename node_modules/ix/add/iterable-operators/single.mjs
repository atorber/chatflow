import { IterableX } from '../../iterable/iterablex';
import { single } from '../../iterable/single';
/**
 * @ignore
 */
export function singleProto(options) {
    return single(this, options);
}
IterableX.prototype.single = singleProto;

//# sourceMappingURL=single.mjs.map
