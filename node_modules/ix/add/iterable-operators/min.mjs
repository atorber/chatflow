import { IterableX } from '../../iterable/iterablex';
import { min } from '../../iterable/min';
/**
 * @ignore
 */
export function minProto(options) {
    return min(this, options);
}
IterableX.prototype.min = minProto;

//# sourceMappingURL=min.mjs.map
