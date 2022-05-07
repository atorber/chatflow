"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNodeStreamProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const tonodestream_1 = require("../../iterable/tonodestream");
function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new tonodestream_1.IterableReadable(this, options)
        : new tonodestream_1.IterableReadable(this, options);
}
exports.toNodeStreamProto = toNodeStreamProto;
iterablex_1.IterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.js.map
