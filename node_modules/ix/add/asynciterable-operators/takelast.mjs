import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { TakeLastAsyncIterable } from '../../asynciterable/operators/takelast';
/**
 * @ignore
 */
export function takeLastProto(count) {
    return new TakeLastAsyncIterable(this, count);
}
AsyncIterableX.prototype.takeLast = takeLastProto;

//# sourceMappingURL=takelast.mjs.map
