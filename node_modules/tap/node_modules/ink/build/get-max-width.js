"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yoga_layout_prebuilt_1 = __importDefault(require("yoga-layout-prebuilt"));
exports.default = (yogaNode) => {
    return (yogaNode.getComputedWidth() -
        yogaNode.getComputedPadding(yoga_layout_prebuilt_1.default.EDGE_LEFT) -
        yogaNode.getComputedPadding(yoga_layout_prebuilt_1.default.EDGE_RIGHT) -
        yogaNode.getComputedBorder(yoga_layout_prebuilt_1.default.EDGE_LEFT) -
        yogaNode.getComputedBorder(yoga_layout_prebuilt_1.default.EDGE_RIGHT));
};
//# sourceMappingURL=get-max-width.js.map