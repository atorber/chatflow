"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRightProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const scanright_1 = require("../../iterable/operators/scanright");
function scanRightProto(optionsOrAccumulator, seed) {
    return new scanright_1.ScanRightIterable(this, 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator);
}
exports.scanRightProto = scanRightProto;
iterablex_1.IterableX.prototype.scanRight = scanRightProto;

//# sourceMappingURL=scanright.js.map
