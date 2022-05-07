import { IterableX } from '../../iterable/iterablex';
import { find } from '../../iterable/find';
/**
 * @ignore
 */
export function findProto(options) {
    return find(this, options);
}
IterableX.prototype.find = findProto;

//# sourceMappingURL=find.mjs.map
