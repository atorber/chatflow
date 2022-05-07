"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliceProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const slice_1 = require("../../asynciterable/operators/slice");
/**
 * @ignore
 */
function sliceProto(begin, end) {
    return new slice_1.SliceAsyncIterable(this, begin, end);
}
exports.sliceProto = sliceProto;
asynciterablex_1.AsyncIterableX.prototype.slice = sliceProto;

//# sourceMappingURL=slice.js.map
