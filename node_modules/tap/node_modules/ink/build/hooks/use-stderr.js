"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const StderrContext_1 = __importDefault(require("../components/StderrContext"));
/**
 * `useStderr` is a React hook, which exposes stderr stream.
 */
const useStderr = () => react_1.useContext(StderrContext_1.default);
exports.default = useStderr;
//# sourceMappingURL=use-stderr.js.map