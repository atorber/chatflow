"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeUntilProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const takeuntil_1 = require("../../asynciterable/operators/takeuntil");
/**
 * @ignore
 */
function takeUntilProto(other) {
    return new takeuntil_1.TakeUntilAsyncIterable(this, other);
}
exports.takeUntilProto = takeUntilProto;
asynciterablex_1.AsyncIterableX.prototype.takeUntil = takeUntilProto;

//# sourceMappingURL=takeuntil.js.map
