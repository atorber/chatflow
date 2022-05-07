"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRightProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const scanright_1 = require("../../asynciterable/operators/scanright");
/**
 * @ignore
 */
function scanRightProto(options) {
    return new scanright_1.ScanRightAsyncIterable(this, options);
}
exports.scanRightProto = scanRightProto;
asynciterablex_1.AsyncIterableX.prototype.scanRight = scanRightProto;

//# sourceMappingURL=scanright.js.map
