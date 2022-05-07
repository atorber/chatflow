"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const take_1 = require("../../asynciterable/operators/take");
/**
 * @ignore
 */
function takeProto(count) {
    return new take_1.TakeAsyncIterable(this, count);
}
exports.takeProto = takeProto;
asynciterablex_1.AsyncIterableX.prototype.take = takeProto;

//# sourceMappingURL=take.js.map
