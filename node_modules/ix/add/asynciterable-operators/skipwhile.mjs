import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { SkipWhileAsyncIterable } from '../../asynciterable/operators/skipwhile';
export function skipWhileProto(predicate) {
    return new SkipWhileAsyncIterable(this, predicate);
}
AsyncIterableX.prototype.skipWhile = skipWhileProto;

//# sourceMappingURL=skipwhile.mjs.map
