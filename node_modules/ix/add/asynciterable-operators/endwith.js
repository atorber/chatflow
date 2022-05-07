"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endWithProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const endwith_1 = require("../../asynciterable/operators/endwith");
/**
 * @ignore
 */
function endWithProto(...args) {
    return new endwith_1.EndWithAsyncIterable(this, args);
}
exports.endWithProto = endWithProto;
asynciterablex_1.AsyncIterableX.prototype.endWith = endWithProto;

//# sourceMappingURL=endwith.js.map
