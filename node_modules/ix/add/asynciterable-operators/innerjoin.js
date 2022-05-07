"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innerJoinProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const innerjoin_1 = require("../../asynciterable/operators/innerjoin");
/**
 * @ignore
 */
function innerJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return new innerjoin_1.JoinAsyncIterable(this, inner, outerSelector, innerSelector, resultSelector);
}
exports.innerJoinProto = innerJoinProto;
asynciterablex_1.AsyncIterableX.prototype.innerJoin = innerJoinProto;

//# sourceMappingURL=innerjoin.js.map
