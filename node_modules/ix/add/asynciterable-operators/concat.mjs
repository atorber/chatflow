import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { concat } from '../../asynciterable/concat';
/**
 * @ignore
 */
export function concatProto(...args) {
    // @ts-ignore
    return concat(this, ...args);
}
AsyncIterableX.prototype.concat = concatProto;

//# sourceMappingURL=concat.mjs.map
