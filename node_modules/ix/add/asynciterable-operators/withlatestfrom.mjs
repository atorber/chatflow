import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { WithLatestFromAsyncIterable } from '../../asynciterable/operators/withlatestfrom';
export function withLatestFromProto(...args) {
    return new WithLatestFromAsyncIterable(this, args);
}
AsyncIterableX.prototype.withLatestFrom = withLatestFromProto;

//# sourceMappingURL=withlatestfrom.mjs.map
