"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FocusContext = react_1.createContext({
    activeId: undefined,
    add: () => { },
    remove: () => { },
    activate: () => { },
    deactivate: () => { },
    enableFocus: () => { },
    disableFocus: () => { },
    focusNext: () => { },
    focusPrevious: () => { },
    focus: () => { }
});
FocusContext.displayName = 'InternalFocusContext';
exports.default = FocusContext;
//# sourceMappingURL=FocusContext.js.map