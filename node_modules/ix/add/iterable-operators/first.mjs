import { IterableX } from '../../iterable/iterablex';
import { first } from '../../iterable/first';
/**
 * @ignore
 */
export function firstProto(options) {
    return first(this, options);
}
IterableX.prototype.first = firstProto;

//# sourceMappingURL=first.mjs.map
