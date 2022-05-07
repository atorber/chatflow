import { IterableX } from '../../iterable/iterablex';
import { every } from '../../iterable/every';
/**
 * @ignore
 */
export function everyProto(options) {
    return every(this, options);
}
IterableX.prototype.every = everyProto;

//# sourceMappingURL=every.mjs.map
