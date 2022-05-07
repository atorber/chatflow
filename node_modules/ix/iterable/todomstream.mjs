import { from } from '../asynciterable/from';
import { publish } from './operators/publish';
import { IterableX } from '../iterable/iterablex';
import { toDOMStream as asyncIterableToDOMStream, } from '../asynciterable/todomstream';
export function toDOMStream(source, options) {
    if (!options || !('type' in options) || options['type'] !== 'bytes') {
        return asyncIterableToDOMStream(from(source), options);
    }
    return asyncIterableToDOMStream(from(source), options);
}
IterableX.prototype.tee = function () {
    return _getDOMStream(this).tee();
};
IterableX.prototype.pipeTo = function (writable, options) {
    return _getDOMStream(this).pipeTo(writable, options);
};
IterableX.prototype.pipeThrough = function (duplex, options) {
    return _getDOMStream(this).pipeThrough(duplex, options);
};
function _getDOMStream(self) {
    return self._DOMStream || (self._DOMStream = self.pipe(publish(), toDOMStream));
}
export function toDOMStreamProto(options) {
    return !options ? toDOMStream(this) : toDOMStream(this, options);
}
IterableX.prototype.toDOMStream = toDOMStreamProto;

//# sourceMappingURL=todomstream.mjs.map
