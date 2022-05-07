"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const StdoutContext_1 = __importDefault(require("../components/StdoutContext"));
/**
 * `useStdout` is a React hook, which exposes stdout stream.
 */
const useStdout = () => react_1.useContext(StdoutContext_1.default);
exports.default = useStdout;
//# sourceMappingURL=use-stdout.js.map