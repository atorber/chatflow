import { IterableX } from '../../iterable/iterablex';
import { skip } from '../../iterable/operators/skip';
/**
 * @ignore
 */
export function skipProto(count) {
    return skip(count)(this);
}
IterableX.prototype.skip = skipProto;

//# sourceMappingURL=skip.mjs.map
