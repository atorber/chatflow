"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * Transform a string representation of React components before they are written to output.
 * For example, you might want to apply a gradient to text, add a clickable link or create some text effects.
 * These use cases can't accept React nodes as input, they are expecting a string.
 * That's what <Transform> component does, it gives you an output string of its child components and lets you transform it in any way.
 */
const Transform = ({ children, transform }) => {
    if (children === undefined || children === null) {
        return null;
    }
    return (react_1.default.createElement("ink-text", { style: { flexGrow: 0, flexShrink: 1, flexDirection: 'row' }, internal_transform: transform }, children));
};
Transform.displayName = 'Transform';
exports.default = Transform;
//# sourceMappingURL=Transform.js.map