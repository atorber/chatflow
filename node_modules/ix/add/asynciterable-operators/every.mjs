import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { every } from '../../asynciterable/every';
/**
 * @ignore
 */
export function everyProto(options) {
    return every(this, options);
}
AsyncIterableX.prototype.every = everyProto;

//# sourceMappingURL=every.mjs.map
