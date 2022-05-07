import { IterableX } from '../../iterable/iterablex';
import { toDOMStream } from '../../iterable/todomstream';
export function toDOMStreamProto(options) {
    return !options ? toDOMStream(this) : toDOMStream(this, options);
}
IterableX.prototype.toDOMStream = toDOMStreamProto;

//# sourceMappingURL=todomstream.mjs.map
