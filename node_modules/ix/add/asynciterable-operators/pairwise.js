"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pairwiseProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const pairwise_1 = require("../../asynciterable/operators/pairwise");
/**
 * @ignore
 */
function pairwiseProto() {
    return new pairwise_1.PairwiseAsyncIterable(this);
}
exports.pairwiseProto = pairwiseProto;
asynciterablex_1.AsyncIterableX.prototype.pairwise = pairwiseProto;

//# sourceMappingURL=pairwise.js.map
