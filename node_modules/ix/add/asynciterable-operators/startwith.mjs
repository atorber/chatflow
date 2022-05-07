import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { StartWithAsyncIterable } from '../../asynciterable/operators/startwith';
/**
 * @ignore
 */
export function startWithProto(...args) {
    return new StartWithAsyncIterable(this, args);
}
AsyncIterableX.prototype.startWith = startWithProto;

//# sourceMappingURL=startwith.mjs.map
