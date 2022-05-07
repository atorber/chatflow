"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FocusContext_1 = __importDefault(require("../components/FocusContext"));
const use_stdin_1 = __importDefault(require("./use-stdin"));
/**
 * Component that uses `useFocus` hook becomes "focusable" to Ink,
 * so when user presses <kbd>Tab</kbd>, Ink will switch focus to this component.
 * If there are multiple components that execute `useFocus` hook, focus will be
 * given to them in the order that these components are rendered in.
 * This hook returns an object with `isFocused` boolean property, which
 * determines if this component is focused or not.
 */
const useFocus = ({ isActive = true, autoFocus = false, id: customId } = {}) => {
    const { isRawModeSupported, setRawMode } = use_stdin_1.default();
    const { activeId, add, remove, activate, deactivate, focus } = react_1.useContext(FocusContext_1.default);
    const id = react_1.useMemo(() => {
        return customId !== null && customId !== void 0 ? customId : Math.random().toString().slice(2, 7);
    }, [customId]);
    react_1.useEffect(() => {
        add(id, { autoFocus });
        return () => {
            remove(id);
        };
    }, [id, autoFocus]);
    react_1.useEffect(() => {
        if (isActive) {
            activate(id);
        }
        else {
            deactivate(id);
        }
    }, [isActive, id]);
    react_1.useEffect(() => {
        if (!isRawModeSupported || !isActive) {
            return;
        }
        setRawMode(true);
        return () => {
            setRawMode(false);
        };
    }, [isActive]);
    return {
        isFocused: Boolean(id) && activeId === id,
        focus
    };
};
exports.default = useFocus;
//# sourceMappingURL=use-focus.js.map