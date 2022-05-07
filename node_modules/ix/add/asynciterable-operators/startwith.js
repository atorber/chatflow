"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWithProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const startwith_1 = require("../../asynciterable/operators/startwith");
/**
 * @ignore
 */
function startWithProto(...args) {
    return new startwith_1.StartWithAsyncIterable(this, args);
}
exports.startWithProto = startWithProto;
asynciterablex_1.AsyncIterableX.prototype.startWith = startWithProto;

//# sourceMappingURL=startwith.js.map
