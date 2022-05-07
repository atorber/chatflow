"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Box_1 = __importDefault(require("./Box"));
/**
 * A flexible space that expands along the major axis of its containing layout.
 * It's useful as a shortcut for filling all the available spaces between elements.
 */
const Spacer = () => react_1.default.createElement(Box_1.default, { flexGrow: 1 });
Spacer.displayName = 'Spacer';
exports.default = Spacer;
//# sourceMappingURL=Spacer.js.map