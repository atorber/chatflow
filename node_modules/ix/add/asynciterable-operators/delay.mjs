import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { DelayAsyncIterable } from '../../asynciterable/operators/delay';
export function delayProto(dueTime) {
    return new DelayAsyncIterable(this, dueTime);
}
AsyncIterableX.prototype.delay = delayProto;

//# sourceMappingURL=delay.mjs.map
