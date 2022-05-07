import { IterableX } from '../../iterable/iterablex';
import { expand } from '../../iterable/operators/expand';
/**
 * @ignore
 */
export function expandProto(fn) {
    return expand(fn)(this);
}
IterableX.prototype.expand = expandProto;

//# sourceMappingURL=expand.mjs.map
