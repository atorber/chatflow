"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * `StdoutContext` is a React context, which exposes stdout stream, where Ink renders your app.
 */
const StdoutContext = react_1.createContext({
    stdout: undefined,
    write: () => { }
});
StdoutContext.displayName = 'InternalStdoutContext';
exports.default = StdoutContext;
//# sourceMappingURL=StdoutContext.js.map