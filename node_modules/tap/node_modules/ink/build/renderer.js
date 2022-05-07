"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yoga_layout_prebuilt_1 = __importDefault(require("yoga-layout-prebuilt"));
const render_node_to_output_1 = __importDefault(require("./render-node-to-output"));
const output_1 = __importDefault(require("./output"));
exports.default = (node, terminalWidth) => {
    var _a;
    node.yogaNode.setWidth(terminalWidth);
    if (node.yogaNode) {
        node.yogaNode.calculateLayout(undefined, undefined, yoga_layout_prebuilt_1.default.DIRECTION_LTR);
        const output = new output_1.default({
            width: node.yogaNode.getComputedWidth(),
            height: node.yogaNode.getComputedHeight()
        });
        render_node_to_output_1.default(node, output, { skipStaticElements: true });
        let staticOutput;
        if ((_a = node.staticNode) === null || _a === void 0 ? void 0 : _a.yogaNode) {
            staticOutput = new output_1.default({
                width: node.staticNode.yogaNode.getComputedWidth(),
                height: node.staticNode.yogaNode.getComputedHeight()
            });
            render_node_to_output_1.default(node.staticNode, staticOutput, {
                skipStaticElements: false
            });
        }
        const { output: generatedOutput, height: outputHeight } = output.get();
        return {
            output: generatedOutput,
            outputHeight,
            // Newline at the end is needed, because static output doesn't have one, so
            // interactive output will override last line of static output
            staticOutput: staticOutput ? `${staticOutput.get().output}\n` : ''
        };
    }
    return {
        output: '',
        outputHeight: 0,
        staticOutput: ''
    };
};
//# sourceMappingURL=renderer.js.map