import { IterableX } from '../../iterable/iterablex';
import { some } from '../../iterable/some';
/**
 * @ignore
 */
export function someProto(options) {
    return some(this, options);
}
IterableX.prototype.some = someProto;

//# sourceMappingURL=some.mjs.map
