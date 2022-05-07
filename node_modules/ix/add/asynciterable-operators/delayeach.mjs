import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { DelayEachAsyncIterable } from '../../asynciterable/operators/delayeach';
export function delayEachProto(dueTime) {
    return new DelayEachAsyncIterable(this, dueTime);
}
AsyncIterableX.prototype.delayEach = delayEachProto;

//# sourceMappingURL=delayeach.mjs.map
