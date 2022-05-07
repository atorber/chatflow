"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const RGB_LIKE_REGEX = /^(rgb|hsl|hsv|hwb)\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/;
const ANSI_REGEX = /^(ansi|ansi256)\(\s?(\d+)\s?\)$/;
const getMethod = (name, type) => {
    if (type === 'foreground') {
        return name;
    }
    return 'bg' + name[0].toUpperCase() + name.slice(1);
};
exports.default = (str, color, type) => {
    if (!color) {
        return str;
    }
    if (color in chalk_1.default) {
        const method = getMethod(color, type);
        return chalk_1.default[method](str);
    }
    if (color.startsWith('#')) {
        const method = getMethod('hex', type);
        return chalk_1.default[method](color)(str);
    }
    if (color.startsWith('ansi')) {
        const matches = ANSI_REGEX.exec(color);
        if (!matches) {
            return str;
        }
        const method = getMethod(matches[1], type);
        const value = Number(matches[2]);
        return chalk_1.default[method](value)(str);
    }
    const isRgbLike = color.startsWith('rgb') ||
        color.startsWith('hsl') ||
        color.startsWith('hsv') ||
        color.startsWith('hwb');
    if (isRgbLike) {
        const matches = RGB_LIKE_REGEX.exec(color);
        if (!matches) {
            return str;
        }
        const method = getMethod(matches[1], type);
        const firstValue = Number(matches[2]);
        const secondValue = Number(matches[3]);
        const thirdValue = Number(matches[4]);
        return chalk_1.default[method](firstValue, secondValue, thirdValue)(str);
    }
    return str;
};
//# sourceMappingURL=colorize.js.map