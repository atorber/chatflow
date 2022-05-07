"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withLatestFromProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const withlatestfrom_1 = require("../../asynciterable/operators/withlatestfrom");
function withLatestFromProto(...args) {
    return new withlatestfrom_1.WithLatestFromAsyncIterable(this, args);
}
exports.withLatestFromProto = withLatestFromProto;
asynciterablex_1.AsyncIterableX.prototype.withLatestFrom = withLatestFromProto;

//# sourceMappingURL=withlatestfrom.js.map
