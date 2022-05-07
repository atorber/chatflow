"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * Adds one or more newline (\n) characters. Must be used within <Text> components.
 */
const Newline = ({ count = 1 }) => (react_1.default.createElement("ink-text", null, '\n'.repeat(count)));
Newline.displayName = 'Newline';
exports.default = Newline;
//# sourceMappingURL=Newline.js.map