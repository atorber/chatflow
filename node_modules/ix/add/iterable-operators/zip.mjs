import { IterableX } from '../../iterable/iterablex';
import { zip } from '../../iterable/zip';
export function zipProto(...args) {
    return zip([this, ...args]);
}
IterableX.prototype.zip = zipProto;

//# sourceMappingURL=zip.mjs.map
