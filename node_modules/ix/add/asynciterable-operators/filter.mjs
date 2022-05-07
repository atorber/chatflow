import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { FilterAsyncIterable } from '../../asynciterable/operators/filter';
export function filterProto(predicate, thisArg) {
    return new FilterAsyncIterable(this, predicate, thisArg);
}
AsyncIterableX.prototype.filter = filterProto;

//# sourceMappingURL=filter.mjs.map
