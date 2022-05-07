import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { find } from '../../asynciterable/find';
/**
 * @ignore
 */
export async function findProto(options) {
    return find(this, options);
}
AsyncIterableX.prototype.find = findProto;

//# sourceMappingURL=find.mjs.map
