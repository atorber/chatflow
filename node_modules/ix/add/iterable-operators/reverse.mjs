import { IterableX } from '../../iterable/iterablex';
import { reverse } from '../../iterable/operators/reverse';
/**
 * @ignore
 */
export function reverseProto() {
    return reverse()(this);
}
IterableX.prototype.reverse = reverseProto;

//# sourceMappingURL=reverse.mjs.map
