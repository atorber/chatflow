"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * `StderrContext` is a React context, which exposes stderr stream.
 */
const StderrContext = react_1.createContext({
    stderr: undefined,
    write: () => { }
});
StderrContext.displayName = 'InternalStderrContext';
exports.default = StderrContext;
//# sourceMappingURL=StderrContext.js.map