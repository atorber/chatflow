import { IterableX } from '../../iterable/iterablex';
import { takeLast } from '../../iterable/operators/takelast';
/**
 * @ignore
 */
export function takeLastProto(count) {
    return takeLast(count)(this);
}
IterableX.prototype.takeLast = takeLastProto;

//# sourceMappingURL=takelast.mjs.map
