import { IterableX } from '../../iterable/iterablex';
import { endWith } from '../../iterable/operators/endwith';
/**
 * @ignore
 */
export function endWithProto(...args) {
    return endWith(...args)(this);
}
IterableX.prototype.endWith = endWithProto;

//# sourceMappingURL=endwith.mjs.map
