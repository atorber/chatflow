"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const scan_1 = require("../../iterable/operators/scan");
function scanProto(optionsOrAccumulator, seed) {
    return new scan_1.ScanIterable(this, 
    // eslint-disable-next-line no-nested-ternary
    typeof optionsOrAccumulator === 'function'
        ? arguments.length > 1
            ? // prettier-ignore
                { 'callback': optionsOrAccumulator, 'seed': seed }
            : // prettier-ignore
                { 'callback': optionsOrAccumulator }
        : optionsOrAccumulator);
}
exports.scanProto = scanProto;
iterablex_1.IterableX.prototype.scan = scanProto;

//# sourceMappingURL=scan.js.map
