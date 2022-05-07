"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const expand_1 = require("../../asynciterable/operators/expand");
/**
 * @ignore
 */
function expandProto(selector) {
    return new expand_1.ExpandAsyncIterable(this, selector);
}
exports.expandProto = expandProto;
asynciterablex_1.AsyncIterableX.prototype.expand = expandProto;

//# sourceMappingURL=expand.js.map
