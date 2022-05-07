"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipWhileProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const skipwhile_1 = require("../../asynciterable/operators/skipwhile");
function skipWhileProto(predicate) {
    return new skipwhile_1.SkipWhileAsyncIterable(this, predicate);
}
exports.skipWhileProto = skipWhileProto;
asynciterablex_1.AsyncIterableX.prototype.skipWhile = skipWhileProto;

//# sourceMappingURL=skipwhile.js.map
