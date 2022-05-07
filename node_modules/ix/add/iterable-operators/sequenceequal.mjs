import { IterableX } from '../../iterable/iterablex';
import { sequenceEqual } from '../../iterable/sequenceequal';
/**
 * @ignore
 */
export function sequenceEqualProto(other, options) {
    return sequenceEqual(this, other, options);
}
IterableX.prototype.sequenceEqual = sequenceEqualProto;

//# sourceMappingURL=sequenceequal.mjs.map
