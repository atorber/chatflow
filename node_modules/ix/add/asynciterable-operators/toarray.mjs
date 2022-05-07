import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { toArray } from '../../asynciterable/toarray';
/**
 * @ignore
 */
export function toArrayProto() {
    return toArray(this);
}
AsyncIterableX.prototype.toArray = toArrayProto;

//# sourceMappingURL=toarray.mjs.map
