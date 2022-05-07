"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const delay_1 = require("../../asynciterable/operators/delay");
function delayProto(dueTime) {
    return new delay_1.DelayAsyncIterable(this, dueTime);
}
exports.delayProto = delayProto;
asynciterablex_1.AsyncIterableX.prototype.delay = delayProto;

//# sourceMappingURL=delay.js.map
