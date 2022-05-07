import { IterableX } from '../../iterable/iterablex';
import { IterableReadable } from '../../iterable/tonodestream';
export function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new IterableReadable(this, options)
        : new IterableReadable(this, options);
}
IterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.mjs.map
