"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipUntilProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const skipuntil_1 = require("../../asynciterable/operators/skipuntil");
/**
 * @ignore
 */
function skipUntilProto(other) {
    return new skipuntil_1.SkipUntilAsyncIterable(this, other);
}
exports.skipUntilProto = skipUntilProto;
asynciterablex_1.AsyncIterableX.prototype.skipUntil = skipUntilProto;

//# sourceMappingURL=skipuntil.js.map
