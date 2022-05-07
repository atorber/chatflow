"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupJoinProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const groupjoin_1 = require("../../asynciterable/operators/groupjoin");
/**
 * @ignore
 */
function groupJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return new groupjoin_1.GroupJoinAsyncIterable(this, inner, outerSelector, innerSelector, resultSelector);
}
exports.groupJoinProto = groupJoinProto;
asynciterablex_1.AsyncIterableX.prototype.groupJoin = groupJoinProto;

//# sourceMappingURL=groupjoin.js.map
