"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeatProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const repeat_1 = require("../../asynciterable/operators/repeat");
/**
 * @ignore
 */
function repeatProto(count = -1) {
    return new repeat_1.RepeatAsyncIterable(this, count);
}
exports.repeatProto = repeatProto;
asynciterablex_1.AsyncIterableX.prototype.repeat = repeatProto;

//# sourceMappingURL=repeat.js.map
