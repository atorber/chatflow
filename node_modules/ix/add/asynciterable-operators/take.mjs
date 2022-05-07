import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { TakeAsyncIterable } from '../../asynciterable/operators/take';
/**
 * @ignore
 */
export function takeProto(count) {
    return new TakeAsyncIterable(this, count);
}
AsyncIterableX.prototype.take = takeProto;

//# sourceMappingURL=take.mjs.map
