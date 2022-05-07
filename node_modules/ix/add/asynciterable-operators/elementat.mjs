import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { elementAt } from '../../asynciterable/elementat';
/**
 * @ignore
 */
export function elementAtProto(index) {
    return elementAt(this, index);
}
AsyncIterableX.prototype.elementAt = elementAtProto;

//# sourceMappingURL=elementat.mjs.map
