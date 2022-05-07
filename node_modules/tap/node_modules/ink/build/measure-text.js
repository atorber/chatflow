"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const widest_line_1 = __importDefault(require("widest-line"));
const cache = {};
exports.default = (text) => {
    if (text.length === 0) {
        return {
            width: 0,
            height: 0
        };
    }
    if (cache[text]) {
        return cache[text];
    }
    const width = widest_line_1.default(text);
    const height = text.split('\n').length;
    cache[text] = { width, height };
    return { width, height };
};
//# sourceMappingURL=measure-text.js.map