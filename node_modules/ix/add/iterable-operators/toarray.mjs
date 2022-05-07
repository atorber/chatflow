import { IterableX } from '../../iterable/iterablex';
import { toArray } from '../../iterable/toarray';
/**
 * @ignore
 */
export function toArrayProto() {
    return toArray(this);
}
IterableX.prototype.toArray = toArrayProto;

//# sourceMappingURL=toarray.mjs.map
