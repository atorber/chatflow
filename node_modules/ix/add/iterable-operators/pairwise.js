"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pairwiseProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const pairwise_1 = require("../../iterable/operators/pairwise");
/**
 * @ignore
 */
function pairwiseProto() {
    return new pairwise_1.PairwiseIterable(this);
}
exports.pairwiseProto = pairwiseProto;
iterablex_1.IterableX.prototype.pairwise = pairwiseProto;

//# sourceMappingURL=pairwise.js.map
