import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { includes } from '../../asynciterable/includes';
/**
 * @ignore
 */
export function includesProto(searchElement, fromIndex) {
    return includes(this, searchElement, fromIndex);
}
AsyncIterableX.prototype.includes = includesProto;

//# sourceMappingURL=includes.mjs.map
