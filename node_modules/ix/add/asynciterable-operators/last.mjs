import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { last } from '../../asynciterable/last';
/**
 * @ignore
 */
export async function lastProto(options) {
    return last(this, options);
}
AsyncIterableX.prototype.last = lastProto;

//# sourceMappingURL=last.mjs.map
