"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const filter_1 = require("../../asynciterable/operators/filter");
function filterProto(predicate, thisArg) {
    return new filter_1.FilterAsyncIterable(this, predicate, thisArg);
}
exports.filterProto = filterProto;
asynciterablex_1.AsyncIterableX.prototype.filter = filterProto;

//# sourceMappingURL=filter.js.map
