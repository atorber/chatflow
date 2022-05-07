import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { RepeatAsyncIterable } from '../../asynciterable/operators/repeat';
/**
 * @ignore
 */
export function repeatProto(count = -1) {
    return new RepeatAsyncIterable(this, count);
}
AsyncIterableX.prototype.repeat = repeatProto;

//# sourceMappingURL=repeat.mjs.map
