import { IterableX } from '../../iterable/iterablex';
import { toSet } from '../../iterable/toset';
/**
 * @ignore
 */
export function toSetProto() {
    return toSet(this);
}
IterableX.prototype.toSet = toSetProto;

//# sourceMappingURL=toset.mjs.map
