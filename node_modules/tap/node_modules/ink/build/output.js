"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slice_ansi_1 = __importDefault(require("slice-ansi"));
const string_width_1 = __importDefault(require("string-width"));
class Output {
    constructor(options) {
        // Initialize output array with a specific set of rows, so that margin/padding at the bottom is preserved
        this.writes = [];
        const { width, height } = options;
        this.width = width;
        this.height = height;
    }
    write(x, y, text, options) {
        const { transformers } = options;
        if (!text) {
            return;
        }
        this.writes.push({ x, y, text, transformers });
    }
    get() {
        const output = [];
        for (let y = 0; y < this.height; y++) {
            output.push(' '.repeat(this.width));
        }
        for (const write of this.writes) {
            const { x, y, text, transformers } = write;
            const lines = text.split('\n');
            let offsetY = 0;
            for (let line of lines) {
                const currentLine = output[y + offsetY];
                // Line can be missing if `text` is taller than height of pre-initialized `this.output`
                if (!currentLine) {
                    continue;
                }
                const width = string_width_1.default(line);
                for (const transformer of transformers) {
                    line = transformer(line);
                }
                output[y + offsetY] =
                    slice_ansi_1.default(currentLine, 0, x) +
                        line +
                        slice_ansi_1.default(currentLine, x + width);
                offsetY++;
            }
        }
        // eslint-disable-next-line unicorn/prefer-trim-start-end
        const generatedOutput = output.map(line => line.trimRight()).join('\n');
        return {
            output: generatedOutput,
            height: output.length
        };
    }
}
exports.default = Output;
//# sourceMappingURL=output.js.map