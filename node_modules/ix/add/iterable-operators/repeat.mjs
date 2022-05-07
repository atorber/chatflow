import { IterableX } from '../../iterable/iterablex';
import { repeat } from '../../iterable/operators/repeat';
/**
 * @ignore
 */
export function repeatProto(count = -1) {
    return repeat(count)(this);
}
IterableX.prototype.repeat = repeatProto;

//# sourceMappingURL=repeat.mjs.map
