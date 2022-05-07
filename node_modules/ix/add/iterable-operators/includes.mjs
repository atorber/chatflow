import { IterableX } from '../../iterable/iterablex';
import { includes } from '../../iterable/includes';
/**
 * @ignore
 */
export function includesProto(searchElement, fromIndex) {
    return includes(this, searchElement, fromIndex);
}
IterableX.prototype.includes = includesProto;

//# sourceMappingURL=includes.mjs.map
