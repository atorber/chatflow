"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const react_1 = __importDefault(require("react"));
const stack_utils_1 = __importDefault(require("stack-utils"));
const code_excerpt_1 = __importDefault(require("code-excerpt"));
const Box_1 = __importDefault(require("./Box"));
const Text_1 = __importDefault(require("./Text"));
const stackUtils = new stack_utils_1.default({
    cwd: process.cwd(),
    internals: stack_utils_1.default.nodeInternals()
});
const ErrorOverview = ({ error }) => {
    const stack = error.stack ? error.stack.split('\n').slice(1) : undefined;
    const origin = stack ? stackUtils.parseLine(stack[0]) : undefined;
    let excerpt;
    let lineWidth = 0;
    if ((origin === null || origin === void 0 ? void 0 : origin.file) && (origin === null || origin === void 0 ? void 0 : origin.line) && fs.existsSync(origin.file)) {
        const sourceCode = fs.readFileSync(origin.file, 'utf8');
        excerpt = code_excerpt_1.default(sourceCode, origin.line);
        if (excerpt) {
            for (const { line } of excerpt) {
                lineWidth = Math.max(lineWidth, String(line).length);
            }
        }
    }
    return (react_1.default.createElement(Box_1.default, { flexDirection: "column", padding: 1 },
        react_1.default.createElement(Box_1.default, null,
            react_1.default.createElement(Text_1.default, { backgroundColor: "red", color: "white" },
                ' ',
                "ERROR",
                ' '),
            react_1.default.createElement(Text_1.default, null,
                " ",
                error.message)),
        origin && (react_1.default.createElement(Box_1.default, { marginTop: 1 },
            react_1.default.createElement(Text_1.default, { dimColor: true },
                origin.file,
                ":",
                origin.line,
                ":",
                origin.column))),
        origin && excerpt && (react_1.default.createElement(Box_1.default, { marginTop: 1, flexDirection: "column" }, excerpt.map(({ line, value }) => (react_1.default.createElement(Box_1.default, { key: line },
            react_1.default.createElement(Box_1.default, { width: lineWidth + 1 },
                react_1.default.createElement(Text_1.default, { dimColor: line !== origin.line, backgroundColor: line === origin.line ? 'red' : undefined, color: line === origin.line ? 'white' : undefined },
                    String(line).padStart(lineWidth, ' '),
                    ":")),
            react_1.default.createElement(Text_1.default, { key: line, backgroundColor: line === origin.line ? 'red' : undefined, color: line === origin.line ? 'white' : undefined }, ' ' + value)))))),
        error.stack && (react_1.default.createElement(Box_1.default, { marginTop: 1, flexDirection: "column" }, error.stack
            .split('\n')
            .slice(1)
            .map(line => {
            const parsedLine = stackUtils.parseLine(line);
            // If the line from the stack cannot be parsed, we print out the unparsed line.
            if (!parsedLine) {
                return (react_1.default.createElement(Box_1.default, { key: line },
                    react_1.default.createElement(Text_1.default, { dimColor: true }, "- "),
                    react_1.default.createElement(Text_1.default, { dimColor: true, bold: true }, line)));
            }
            return (react_1.default.createElement(Box_1.default, { key: line },
                react_1.default.createElement(Text_1.default, { dimColor: true }, "- "),
                react_1.default.createElement(Text_1.default, { dimColor: true, bold: true }, parsedLine.function),
                react_1.default.createElement(Text_1.default, { dimColor: true, color: "gray" },
                    ' ',
                    "(",
                    parsedLine.file,
                    ":",
                    parsedLine.line,
                    ":",
                    parsedLine.column,
                    ")")));
        })))));
};
exports.default = ErrorOverview;
//# sourceMappingURL=ErrorOverview.js.map