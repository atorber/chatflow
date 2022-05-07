"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatAllProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const concatall_1 = require("../../asynciterable/operators/concatall");
/**
 * @ignore
 */
function concatAllProto() {
    return new concatall_1.ConcatAllAsyncIterable(this);
}
exports.concatAllProto = concatAllProto;
asynciterablex_1.AsyncIterableX.prototype.concatAll = concatAllProto;

//# sourceMappingURL=concatall.js.map
