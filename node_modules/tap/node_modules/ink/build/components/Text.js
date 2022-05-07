"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const chalk_1 = __importDefault(require("chalk"));
const colorize_1 = __importDefault(require("../colorize"));
/**
 * This component can display text, and change its style to make it colorful, bold, underline, italic or strikethrough.
 */
const Text = ({ color, backgroundColor, dimColor, bold, italic, underline, strikethrough, inverse, wrap, children }) => {
    if (children === undefined || children === null) {
        return null;
    }
    const transform = (children) => {
        if (dimColor) {
            children = chalk_1.default.dim(children);
        }
        if (color) {
            children = colorize_1.default(children, color, 'foreground');
        }
        if (backgroundColor) {
            children = colorize_1.default(children, backgroundColor, 'background');
        }
        if (bold) {
            children = chalk_1.default.bold(children);
        }
        if (italic) {
            children = chalk_1.default.italic(children);
        }
        if (underline) {
            children = chalk_1.default.underline(children);
        }
        if (strikethrough) {
            children = chalk_1.default.strikethrough(children);
        }
        if (inverse) {
            children = chalk_1.default.inverse(children);
        }
        return children;
    };
    return (react_1.default.createElement("ink-text", { style: { flexGrow: 0, flexShrink: 1, flexDirection: 'row', textWrap: wrap }, internal_transform: transform }, children));
};
Text.displayName = 'Text';
Text.defaultProps = {
    dimColor: false,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    wrap: 'wrap'
};
exports.default = Text;
//# sourceMappingURL=Text.js.map