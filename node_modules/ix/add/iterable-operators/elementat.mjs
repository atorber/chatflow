import { IterableX } from '../../iterable/iterablex';
import { elementAt } from '../../iterable/elementat';
/**
 * @ignore
 */
export function elementAtProto(index) {
    return elementAt(this, index);
}
IterableX.prototype.elementAt = elementAtProto;

//# sourceMappingURL=elementat.mjs.map
