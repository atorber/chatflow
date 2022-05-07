import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { isEmpty } from '../../asynciterable/isempty';
/**
 * @ignore
 */
export function isEmptyProto() {
    return isEmpty(this);
}
AsyncIterableX.prototype.isEmpty = isEmptyProto;

//# sourceMappingURL=isempty.mjs.map
