import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { retry } from '../../asynciterable/operators/retry';
/**
 * @ignore
 */
export function retryProto(count = -1) {
    return retry(count)(this);
}
AsyncIterableX.prototype.retry = retryProto;

//# sourceMappingURL=retry.mjs.map
