import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ReverseAsyncIterable } from '../../asynciterable/operators/reverse';
/**
 * @ignore
 */
export function reverseProto() {
    return new ReverseAsyncIterable(this);
}
AsyncIterableX.prototype.reverse = reverseProto;

//# sourceMappingURL=reverse.mjs.map
