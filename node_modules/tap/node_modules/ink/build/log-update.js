"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_escapes_1 = __importDefault(require("ansi-escapes"));
const cli_cursor_1 = __importDefault(require("cli-cursor"));
const create = (stream, { showCursor = false } = {}) => {
    let previousLineCount = 0;
    let previousOutput = '';
    let hasHiddenCursor = false;
    const render = (str) => {
        if (!showCursor && !hasHiddenCursor) {
            cli_cursor_1.default.hide();
            hasHiddenCursor = true;
        }
        const output = str + '\n';
        if (output === previousOutput) {
            return;
        }
        previousOutput = output;
        stream.write(ansi_escapes_1.default.eraseLines(previousLineCount) + output);
        previousLineCount = output.split('\n').length;
    };
    render.clear = () => {
        stream.write(ansi_escapes_1.default.eraseLines(previousLineCount));
        previousOutput = '';
        previousLineCount = 0;
    };
    render.done = () => {
        previousOutput = '';
        previousLineCount = 0;
        if (!showCursor) {
            cli_cursor_1.default.show();
            hasHiddenCursor = false;
        }
    };
    return render;
};
exports.default = { create };
//# sourceMappingURL=log-update.js.map