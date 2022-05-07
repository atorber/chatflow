import { IterableX } from '../../iterable/iterablex';
import { take } from '../../iterable/operators/take';
/**
 * @ignore
 */
export function takeProto(count) {
    return take(count)(this);
}
IterableX.prototype.take = takeProto;

//# sourceMappingURL=take.mjs.map
