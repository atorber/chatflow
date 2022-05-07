"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNodeStreamProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const tonodestream_1 = require("../../asynciterable/tonodestream");
function toNodeStreamProto(options) {
    return !options || options.objectMode === true
        ? new tonodestream_1.AsyncIterableReadable(this, options)
        : new tonodestream_1.AsyncIterableReadable(this, options);
}
exports.toNodeStreamProto = toNodeStreamProto;
asynciterablex_1.AsyncIterableX.prototype.toNodeStream = toNodeStreamProto;

//# sourceMappingURL=tonodestream.js.map
