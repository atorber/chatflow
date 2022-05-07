"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yoga_layout_prebuilt_1 = __importDefault(require("yoga-layout-prebuilt"));
const widest_line_1 = __importDefault(require("widest-line"));
const indent_string_1 = __importDefault(require("indent-string"));
const wrap_text_1 = __importDefault(require("./wrap-text"));
const get_max_width_1 = __importDefault(require("./get-max-width"));
const squash_text_nodes_1 = __importDefault(require("./squash-text-nodes"));
const render_border_1 = __importDefault(require("./render-border"));
// If parent container is `<Box>`, text nodes will be treated as separate nodes in
// the tree and will have their own coordinates in the layout.
// To ensure text nodes are aligned correctly, take X and Y of the first text node
// and use it as offset for the rest of the nodes
// Only first node is taken into account, because other text nodes can't have margin or padding,
// so their coordinates will be relative to the first node anyway
const applyPaddingToText = (node, text) => {
    var _a;
    const yogaNode = (_a = node.childNodes[0]) === null || _a === void 0 ? void 0 : _a.yogaNode;
    if (yogaNode) {
        const offsetX = yogaNode.getComputedLeft();
        const offsetY = yogaNode.getComputedTop();
        text = '\n'.repeat(offsetY) + indent_string_1.default(text, offsetX);
    }
    return text;
};
// After nodes are laid out, render each to output object, which later gets rendered to terminal
const renderNodeToOutput = (node, output, options) => {
    var _a;
    const { offsetX = 0, offsetY = 0, transformers = [], skipStaticElements } = options;
    if (skipStaticElements && node.internal_static) {
        return;
    }
    const { yogaNode } = node;
    if (yogaNode) {
        if (yogaNode.getDisplay() === yoga_layout_prebuilt_1.default.DISPLAY_NONE) {
            return;
        }
        // Left and top positions in Yoga are relative to their parent node
        const x = offsetX + yogaNode.getComputedLeft();
        const y = offsetY + yogaNode.getComputedTop();
        // Transformers are functions that transform final text output of each component
        // See Output class for logic that applies transformers
        let newTransformers = transformers;
        if (typeof node.internal_transform === 'function') {
            newTransformers = [node.internal_transform, ...transformers];
        }
        if (node.nodeName === 'ink-text') {
            let text = squash_text_nodes_1.default(node);
            if (text.length > 0) {
                const currentWidth = widest_line_1.default(text);
                const maxWidth = get_max_width_1.default(yogaNode);
                if (currentWidth > maxWidth) {
                    const textWrap = (_a = node.style.textWrap) !== null && _a !== void 0 ? _a : 'wrap';
                    text = wrap_text_1.default(text, maxWidth, textWrap);
                }
                text = applyPaddingToText(node, text);
                output.write(x, y, text, { transformers: newTransformers });
            }
            return;
        }
        if (node.nodeName === 'ink-box') {
            render_border_1.default(x, y, node, output);
        }
        if (node.nodeName === 'ink-root' || node.nodeName === 'ink-box') {
            for (const childNode of node.childNodes) {
                renderNodeToOutput(childNode, output, {
                    offsetX: x,
                    offsetY: y,
                    transformers: newTransformers,
                    skipStaticElements
                });
            }
        }
    }
};
exports.default = renderNodeToOutput;
//# sourceMappingURL=render-node-to-output.js.map