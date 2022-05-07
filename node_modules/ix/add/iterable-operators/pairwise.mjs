import { IterableX } from '../../iterable/iterablex';
import { PairwiseIterable } from '../../iterable/operators/pairwise';
/**
 * @ignore
 */
export function pairwiseProto() {
    return new PairwiseIterable(this);
}
IterableX.prototype.pairwise = pairwiseProto;

//# sourceMappingURL=pairwise.mjs.map
