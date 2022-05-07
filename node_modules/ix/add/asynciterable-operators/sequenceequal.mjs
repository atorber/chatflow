import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { sequenceEqual } from '../../asynciterable/sequenceequal';
/**
 * @ignore
 */
export async function sequenceEqualProto(other, options) {
    return sequenceEqual(this, other, options);
}
AsyncIterableX.prototype.sequenceEqual = sequenceEqualProto;

//# sourceMappingURL=sequenceequal.mjs.map
