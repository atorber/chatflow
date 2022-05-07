import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { SkipUntilAsyncIterable } from '../../asynciterable/operators/skipuntil';
/**
 * @ignore
 */
export function skipUntilProto(other) {
    return new SkipUntilAsyncIterable(this, other);
}
AsyncIterableX.prototype.skipUntil = skipUntilProto;

//# sourceMappingURL=skipuntil.mjs.map
