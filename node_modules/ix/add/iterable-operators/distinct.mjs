import { IterableX } from '../../iterable/iterablex';
import { distinct } from '../../iterable/operators/distinct';
/**
 * @ignore
 */
export function distinctProto(options) {
    return distinct(options)(this);
}
IterableX.prototype.distinct = distinctProto;

//# sourceMappingURL=distinct.mjs.map
