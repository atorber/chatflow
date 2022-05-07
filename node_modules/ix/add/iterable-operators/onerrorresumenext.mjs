import { IterableX } from '../../iterable/iterablex';
import { onErrorResumeNext } from '../../iterable/onerrorresumenext';
/**
 * @ignore
 */
export function onErrorResumeNextProto(...args) {
    return onErrorResumeNext(this, ...args);
}
IterableX.prototype.onErrorResumeNext = onErrorResumeNextProto;

//# sourceMappingURL=onerrorresumenext.mjs.map
