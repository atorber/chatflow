import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ExpandAsyncIterable } from '../../asynciterable/operators/expand';
/**
 * @ignore
 */
export function expandProto(selector) {
    return new ExpandAsyncIterable(this, selector);
}
AsyncIterableX.prototype.expand = expandProto;

//# sourceMappingURL=expand.mjs.map
