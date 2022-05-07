"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const StdinContext_1 = __importDefault(require("../components/StdinContext"));
/**
 * `useStdin` is a React hook, which exposes stdin stream.
 */
const useStdin = () => react_1.useContext(StdinContext_1.default);
exports.default = useStdin;
//# sourceMappingURL=use-stdin.js.map