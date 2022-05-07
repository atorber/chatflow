import { IterableX } from '../../iterable/iterablex';
import { except } from '../../iterable/operators/except';
/**
 * @ignore
 */
export function exceptProto(second, comparer) {
    return except(second, comparer)(this);
}
IterableX.prototype.except = exceptProto;

//# sourceMappingURL=except.mjs.map
