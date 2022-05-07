"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const scan_1 = require("../../asynciterable/operators/scan");
/**
 * @ignore
 */
function scanProto(options) {
    return new scan_1.ScanAsyncIterable(this, options);
}
exports.scanProto = scanProto;
asynciterablex_1.AsyncIterableX.prototype.scan = scanProto;

//# sourceMappingURL=scan.js.map
