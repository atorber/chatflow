import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { GroupByAsyncIterable } from '../../asynciterable/operators/groupby';
import { identityAsync } from '../../util/identity';
export function groupByProto(keySelector, elementSelector = identityAsync) {
    return new GroupByAsyncIterable(this, keySelector, elementSelector);
}
AsyncIterableX.prototype.groupBy = groupByProto;

//# sourceMappingURL=groupby.mjs.map
