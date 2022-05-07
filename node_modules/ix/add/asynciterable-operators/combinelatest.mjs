import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { combineLatest } from '../../asynciterable/combinelatest';
export function combineLatestProto(...sources) {
    return combineLatest(...[this, ...sources]);
}
AsyncIterableX.prototype.combineLatest = combineLatestProto;

//# sourceMappingURL=combinelatest.mjs.map
