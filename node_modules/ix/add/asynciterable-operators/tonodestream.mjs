import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { AsyncIterableReadable } from '../../asynciterable/tonodestream';
export function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new AsyncIterableReadable(this, options)
        : new AsyncIterableReadable(this, options);
}
AsyncIterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.mjs.map
