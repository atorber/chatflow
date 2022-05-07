"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * `StdinContext` is a React context, which exposes input stream.
 */
const StdinContext = react_1.createContext({
    stdin: undefined,
    setRawMode: () => { },
    isRawModeSupported: false,
    internal_exitOnCtrlC: true
});
StdinContext.displayName = 'InternalStdinContext';
exports.default = StdinContext;
//# sourceMappingURL=StdinContext.js.map