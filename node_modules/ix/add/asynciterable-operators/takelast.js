"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeLastProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const takelast_1 = require("../../asynciterable/operators/takelast");
/**
 * @ignore
 */
function takeLastProto(count) {
    return new takelast_1.TakeLastAsyncIterable(this, count);
}
exports.takeLastProto = takeLastProto;
asynciterablex_1.AsyncIterableX.prototype.takeLast = takeLastProto;

//# sourceMappingURL=takelast.js.map
