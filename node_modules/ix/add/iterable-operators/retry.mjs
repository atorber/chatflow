import { IterableX } from '../../iterable/iterablex';
import { retry } from '../../iterable/operators/retry';
/**
 * @ignore
 */
export function retryProto(count = -1) {
    return retry(count)(this);
}
IterableX.prototype.retry = retryProto;

//# sourceMappingURL=retry.mjs.map
