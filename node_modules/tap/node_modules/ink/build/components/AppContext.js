"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * `AppContext` is a React context, which exposes a method to manually exit the app (unmount).
 */
const AppContext = react_1.createContext({
    exit: () => { }
});
AppContext.displayName = 'InternalAppContext';
exports.default = AppContext;
//# sourceMappingURL=AppContext.js.map