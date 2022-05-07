"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const skip_1 = require("../../asynciterable/operators/skip");
/**
 * @ignore
 */
function skipProto(count) {
    return new skip_1.SkipAsyncIterable(this, count);
}
exports.skipProto = skipProto;
asynciterablex_1.AsyncIterableX.prototype.skip = skipProto;

//# sourceMappingURL=skip.js.map
