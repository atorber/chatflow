import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { TakeUntilAsyncIterable } from '../../asynciterable/operators/takeuntil';
/**
 * @ignore
 */
export function takeUntilProto(other) {
    return new TakeUntilAsyncIterable(this, other);
}
AsyncIterableX.prototype.takeUntil = takeUntilProto;

//# sourceMappingURL=takeuntil.mjs.map
