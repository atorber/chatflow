import { IterableX } from '../../iterable/iterablex';
import { flat } from '../../iterable/operators/flat';
/**
 * @ignore
 */
export function flatProto(depth) {
    return flat(depth)(this);
}
IterableX.prototype.flat = flatProto;

//# sourceMappingURL=flat.mjs.map
