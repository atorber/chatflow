import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { zip } from '../../asynciterable/zip';
export function zipProto(...args) {
    return zip(...[this, ...args]);
}
AsyncIterableX.prototype.zip = zipProto;

//# sourceMappingURL=zip.mjs.map
