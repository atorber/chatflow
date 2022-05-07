"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_boxes_1 = __importDefault(require("cli-boxes"));
const colorize_1 = __importDefault(require("./colorize"));
exports.default = (x, y, node, output) => {
    if (typeof node.style.borderStyle === 'string') {
        const width = node.yogaNode.getComputedWidth();
        const height = node.yogaNode.getComputedHeight();
        const color = node.style.borderColor;
        const box = cli_boxes_1.default[node.style.borderStyle];
        const topBorder = colorize_1.default(box.topLeft + box.horizontal.repeat(width - 2) + box.topRight, color, 'foreground');
        const verticalBorder = (colorize_1.default(box.vertical, color, 'foreground') + '\n').repeat(height - 2);
        const bottomBorder = colorize_1.default(box.bottomLeft + box.horizontal.repeat(width - 2) + box.bottomRight, color, 'foreground');
        output.write(x, y, topBorder, { transformers: [] });
        output.write(x, y + 1, verticalBorder, { transformers: [] });
        output.write(x + width - 1, y + 1, verticalBorder, { transformers: [] });
        output.write(x, y + height - 1, bottomBorder, { transformers: [] });
    }
};
//# sourceMappingURL=render-border.js.map