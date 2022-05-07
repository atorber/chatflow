import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { EndWithAsyncIterable } from '../../asynciterable/operators/endwith';
/**
 * @ignore
 */
export function endWithProto(...args) {
    return new EndWithAsyncIterable(this, args);
}
AsyncIterableX.prototype.endWith = endWithProto;

//# sourceMappingURL=endwith.mjs.map
