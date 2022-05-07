"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttleProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const throttle_1 = require("../../asynciterable/operators/throttle");
/**
 * @ignore
 */
function throttleProto(time) {
    return new throttle_1.ThrottleAsyncIterable(this, time);
}
exports.throttleProto = throttleProto;
asynciterablex_1.AsyncIterableX.prototype.throttle = throttleProto;

//# sourceMappingURL=throttle.js.map
