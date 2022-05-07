"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Measure the dimensions of a particular `<Box>` element.
 */
exports.default = (node) => {
    var _a, _b, _c, _d;
    return ({
        width: (_b = (_a = node.yogaNode) === null || _a === void 0 ? void 0 : _a.getComputedWidth()) !== null && _b !== void 0 ? _b : 0,
        height: (_d = (_c = node.yogaNode) === null || _c === void 0 ? void 0 : _c.getComputedHeight()) !== null && _d !== void 0 ? _d : 0
    });
};
//# sourceMappingURL=measure-element.js.map