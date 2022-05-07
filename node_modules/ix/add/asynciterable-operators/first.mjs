import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { first } from '../../asynciterable/first';
/**
 * @ignore
 */
export async function firstProto(options) {
    return first(this, options);
}
AsyncIterableX.prototype.first = firstProto;

//# sourceMappingURL=first.mjs.map
