import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { SkipAsyncIterable } from '../../asynciterable/operators/skip';
/**
 * @ignore
 */
export function skipProto(count) {
    return new SkipAsyncIterable(this, count);
}
AsyncIterableX.prototype.skip = skipProto;

//# sourceMappingURL=skip.mjs.map
