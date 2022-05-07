"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const map_1 = require("../../asynciterable/operators/map");
/**
 * @ignore
 */
function mapProto(selector, thisArg) {
    return new map_1.MapAsyncIterable(this, selector, thisArg);
}
exports.mapProto = mapProto;
asynciterablex_1.AsyncIterableX.prototype.map = mapProto;

//# sourceMappingURL=map.js.map
