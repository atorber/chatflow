import { IterableX } from '../../iterable/iterablex';
import { isEmpty } from '../../iterable/isempty';
/**
 * @ignore
 */
export function isEmptyProto() {
    return isEmpty(this);
}
IterableX.prototype.isEmpty = isEmptyProto;

//# sourceMappingURL=isempty.mjs.map
