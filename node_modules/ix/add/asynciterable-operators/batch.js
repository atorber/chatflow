"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const batch_1 = require("../../asynciterable/operators/batch");
/**
 * @ignore
 */
function batchProto() {
    return new batch_1.BatchAsyncIterable(this);
}
exports.batchProto = batchProto;
asynciterablex_1.AsyncIterableX.prototype.batch = batchProto;

//# sourceMappingURL=batch.js.map
