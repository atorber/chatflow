import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { forkJoin } from '../../asynciterable/forkjoin';
export function forkJoinProto(...args) {
    return forkJoin(...[this, ...args]);
}
AsyncIterableX.prototype.forkJoin = forkJoinProto;

//# sourceMappingURL=forkjoin.mjs.map
