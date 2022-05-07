"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FocusContext_1 = __importDefault(require("../components/FocusContext"));
/**
 * This hook exposes methods to enable or disable focus management for all
 * components or manually switch focus to next or previous components.
 */
const useFocusManager = () => {
    const focusContext = react_1.useContext(FocusContext_1.default);
    return {
        enableFocus: focusContext.enableFocus,
        disableFocus: focusContext.disableFocus,
        focusNext: focusContext.focusNext,
        focusPrevious: focusContext.focusPrevious,
        focus: focusContext.focus
    };
};
exports.default = useFocusManager;
//# sourceMappingURL=use-focus-manager.js.map