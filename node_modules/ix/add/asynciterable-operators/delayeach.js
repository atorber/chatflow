"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayEachProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const delayeach_1 = require("../../asynciterable/operators/delayeach");
function delayEachProto(dueTime) {
    return new delayeach_1.DelayEachAsyncIterable(this, dueTime);
}
exports.delayEachProto = delayEachProto;
asynciterablex_1.AsyncIterableX.prototype.delayEach = delayEachProto;

//# sourceMappingURL=delayeach.js.map
