import { IterableX } from '../../iterable/iterablex';
import { last } from '../../iterable/last';
/**
 * @ignore
 */
export function lastProto(options) {
    return last(this, options);
}
IterableX.prototype.last = lastProto;

//# sourceMappingURL=last.mjs.map
