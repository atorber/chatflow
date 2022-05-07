import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ThrottleAsyncIterable } from '../../asynciterable/operators/throttle';
/**
 * @ignore
 */
export function throttleProto(time) {
    return new ThrottleAsyncIterable(this, time);
}
AsyncIterableX.prototype.throttle = throttleProto;

//# sourceMappingURL=throttle.mjs.map
