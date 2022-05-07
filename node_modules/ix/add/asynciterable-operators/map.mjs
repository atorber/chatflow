import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { MapAsyncIterable } from '../../asynciterable/operators/map';
/**
 * @ignore
 */
export function mapProto(selector, thisArg) {
    return new MapAsyncIterable(this, selector, thisArg);
}
AsyncIterableX.prototype.map = mapProto;

//# sourceMappingURL=map.mjs.map
