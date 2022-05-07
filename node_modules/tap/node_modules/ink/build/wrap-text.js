"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrap_ansi_1 = __importDefault(require("wrap-ansi"));
const cli_truncate_1 = __importDefault(require("cli-truncate"));
const cache = {};
exports.default = (text, maxWidth, wrapType) => {
    const cacheKey = text + String(maxWidth) + String(wrapType);
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }
    let wrappedText = text;
    if (wrapType === 'wrap') {
        wrappedText = wrap_ansi_1.default(text, maxWidth, {
            trim: false,
            hard: true
        });
    }
    if (wrapType.startsWith('truncate')) {
        let position = 'end';
        if (wrapType === 'truncate-middle') {
            position = 'middle';
        }
        if (wrapType === 'truncate-start') {
            position = 'start';
        }
        wrappedText = cli_truncate_1.default(text, maxWidth, { position });
    }
    cache[cacheKey] = wrappedText;
    return wrappedText;
};
//# sourceMappingURL=wrap-text.js.map