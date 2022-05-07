"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const reverse_1 = require("../../asynciterable/operators/reverse");
/**
 * @ignore
 */
function reverseProto() {
    return new reverse_1.ReverseAsyncIterable(this);
}
exports.reverseProto = reverseProto;
asynciterablex_1.AsyncIterableX.prototype.reverse = reverseProto;

//# sourceMappingURL=reverse.js.map
