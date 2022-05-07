import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { onErrorResumeNext } from '../../asynciterable/onerrorresumenext';
/**
 * @ignore
 */
export function onErrorResumeNextProto(...args) {
    return onErrorResumeNext(this, ...args);
}
AsyncIterableX.prototype.onErrorResumeNext = onErrorResumeNextProto;

//# sourceMappingURL=onerrorresumenext.mjs.map
