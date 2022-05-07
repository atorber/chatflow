import { IterableX } from '../../iterable/iterablex';
import { finalize as _finalize } from '../../iterable/operators/finalize';
/**
 * @ignore
 */
export function finalizeProto(action) {
    return _finalize(action)(this);
}
IterableX.prototype.finally = finalizeProto;

//# sourceMappingURL=finalize.mjs.map
