"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupByProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const groupby_1 = require("../../asynciterable/operators/groupby");
const identity_1 = require("../../util/identity");
function groupByProto(keySelector, elementSelector = identity_1.identityAsync) {
    return new groupby_1.GroupByAsyncIterable(this, keySelector, elementSelector);
}
exports.groupByProto = groupByProto;
asynciterablex_1.AsyncIterableX.prototype.groupBy = groupByProto;

//# sourceMappingURL=groupby.js.map
