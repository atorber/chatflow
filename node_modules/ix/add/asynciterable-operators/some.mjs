import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { some } from '../../asynciterable/some';
/**
 * @ignore
 */
export function someProto(options) {
    return some(this, options);
}
AsyncIterableX.prototype.some = someProto;

//# sourceMappingURL=some.mjs.map
