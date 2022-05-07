"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipLastProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const skiplast_1 = require("../../asynciterable/operators/skiplast");
/**
 * @ignore
 */
function skipLastProto(count) {
    return new skiplast_1.SkipLastAsyncIterable(this, count);
}
exports.skipLastProto = skipLastProto;
asynciterablex_1.AsyncIterableX.prototype.skipLast = skipLastProto;

//# sourceMappingURL=skiplast.js.map
