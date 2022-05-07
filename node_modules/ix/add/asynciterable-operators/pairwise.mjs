import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { PairwiseAsyncIterable } from '../../asynciterable/operators/pairwise';
/**
 * @ignore
 */
export function pairwiseProto() {
    return new PairwiseAsyncIterable(this);
}
AsyncIterableX.prototype.pairwise = pairwiseProto;

//# sourceMappingURL=pairwise.mjs.map
