"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
const react_1 = __importStar(require("react"));
const cli_cursor_1 = __importDefault(require("cli-cursor"));
const AppContext_1 = __importDefault(require("./AppContext"));
const StdinContext_1 = __importDefault(require("./StdinContext"));
const StdoutContext_1 = __importDefault(require("./StdoutContext"));
const StderrContext_1 = __importDefault(require("./StderrContext"));
const FocusContext_1 = __importDefault(require("./FocusContext"));
const ErrorOverview_1 = __importDefault(require("./ErrorOverview"));
const TAB = '\t';
const SHIFT_TAB = '\u001B[Z';
const ESC = '\u001B';
// Root component for all Ink apps
// It renders stdin and stdout contexts, so that children can access them if needed
// It also handles Ctrl+C exiting and cursor visibility
class App extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isFocusEnabled: true,
            activeFocusId: undefined,
            focusables: [],
            error: undefined
        };
        // Count how many components enabled raw mode to avoid disabling
        // raw mode until all components don't need it anymore
        this.rawModeEnabledCount = 0;
        this.handleSetRawMode = (isEnabled) => {
            const { stdin } = this.props;
            if (!this.isRawModeSupported()) {
                if (stdin === process.stdin) {
                    throw new Error('Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported');
                }
                else {
                    throw new Error('Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported');
                }
            }
            stdin.setEncoding('utf8');
            if (isEnabled) {
                // Ensure raw mode is enabled only once
                if (this.rawModeEnabledCount === 0) {
                    stdin.addListener('data', this.handleInput);
                    stdin.resume();
                    stdin.setRawMode(true);
                }
                this.rawModeEnabledCount++;
                return;
            }
            // Disable raw mode only when no components left that are using it
            if (--this.rawModeEnabledCount === 0) {
                stdin.setRawMode(false);
                stdin.removeListener('data', this.handleInput);
                stdin.pause();
            }
        };
        this.handleInput = (input) => {
            // Exit on Ctrl+C
            // eslint-disable-next-line unicorn/no-hex-escape
            if (input === '\x03' && this.props.exitOnCtrlC) {
                this.handleExit();
            }
            // Reset focus when there's an active focused component on Esc
            if (input === ESC && this.state.activeFocusId) {
                this.setState({
                    activeFocusId: undefined
                });
            }
            if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
                if (input === TAB) {
                    this.focusNext();
                }
                if (input === SHIFT_TAB) {
                    this.focusPrevious();
                }
            }
        };
        this.handleExit = (error) => {
            if (this.isRawModeSupported()) {
                this.handleSetRawMode(false);
            }
            this.props.onExit(error);
        };
        this.enableFocus = () => {
            this.setState({
                isFocusEnabled: true
            });
        };
        this.disableFocus = () => {
            this.setState({
                isFocusEnabled: false
            });
        };
        this.focus = (id) => {
            this.setState(previousState => {
                const hasFocusableId = previousState.focusables.some(focusable => (focusable === null || focusable === void 0 ? void 0 : focusable.id) === id);
                if (!hasFocusableId) {
                    return previousState;
                }
                return { activeFocusId: id };
            });
        };
        this.focusNext = () => {
            this.setState(previousState => {
                var _a;
                const firstFocusableId = (_a = previousState.focusables[0]) === null || _a === void 0 ? void 0 : _a.id;
                const nextFocusableId = this.findNextFocusable(previousState);
                return {
                    activeFocusId: nextFocusableId || firstFocusableId
                };
            });
        };
        this.focusPrevious = () => {
            this.setState(previousState => {
                var _a;
                const lastFocusableId = (_a = previousState.focusables[previousState.focusables.length - 1]) === null || _a === void 0 ? void 0 : _a.id;
                const previousFocusableId = this.findPreviousFocusable(previousState);
                return {
                    activeFocusId: previousFocusableId || lastFocusableId
                };
            });
        };
        this.addFocusable = (id, { autoFocus }) => {
            this.setState(previousState => {
                let nextFocusId = previousState.activeFocusId;
                if (!nextFocusId && autoFocus) {
                    nextFocusId = id;
                }
                return {
                    activeFocusId: nextFocusId,
                    focusables: [
                        ...previousState.focusables,
                        {
                            id,
                            isActive: true
                        }
                    ]
                };
            });
        };
        this.removeFocusable = (id) => {
            this.setState(previousState => ({
                activeFocusId: previousState.activeFocusId === id
                    ? undefined
                    : previousState.activeFocusId,
                focusables: previousState.focusables.filter(focusable => {
                    return focusable.id !== id;
                })
            }));
        };
        this.activateFocusable = (id) => {
            this.setState(previousState => ({
                focusables: previousState.focusables.map(focusable => {
                    if (focusable.id !== id) {
                        return focusable;
                    }
                    return {
                        id,
                        isActive: true
                    };
                })
            }));
        };
        this.deactivateFocusable = (id) => {
            this.setState(previousState => ({
                activeFocusId: previousState.activeFocusId === id
                    ? undefined
                    : previousState.activeFocusId,
                focusables: previousState.focusables.map(focusable => {
                    if (focusable.id !== id) {
                        return focusable;
                    }
                    return {
                        id,
                        isActive: false
                    };
                })
            }));
        };
        this.findNextFocusable = (state) => {
            var _a;
            const activeIndex = state.focusables.findIndex(focusable => {
                return focusable.id === state.activeFocusId;
            });
            for (let index = activeIndex + 1; index < state.focusables.length; index++) {
                if ((_a = state.focusables[index]) === null || _a === void 0 ? void 0 : _a.isActive) {
                    return state.focusables[index].id;
                }
            }
            return undefined;
        };
        this.findPreviousFocusable = (state) => {
            var _a;
            const activeIndex = state.focusables.findIndex(focusable => {
                return focusable.id === state.activeFocusId;
            });
            for (let index = activeIndex - 1; index >= 0; index--) {
                if ((_a = state.focusables[index]) === null || _a === void 0 ? void 0 : _a.isActive) {
                    return state.focusables[index].id;
                }
            }
            return undefined;
        };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    // Determines if TTY is supported on the provided stdin
    isRawModeSupported() {
        return this.props.stdin.isTTY;
    }
    render() {
        return (react_1.default.createElement(AppContext_1.default.Provider, { value: {
                exit: this.handleExit
            } },
            react_1.default.createElement(StdinContext_1.default.Provider, { value: {
                    stdin: this.props.stdin,
                    setRawMode: this.handleSetRawMode,
                    isRawModeSupported: this.isRawModeSupported(),
                    internal_exitOnCtrlC: this.props.exitOnCtrlC
                } },
                react_1.default.createElement(StdoutContext_1.default.Provider, { value: {
                        stdout: this.props.stdout,
                        write: this.props.writeToStdout
                    } },
                    react_1.default.createElement(StderrContext_1.default.Provider, { value: {
                            stderr: this.props.stderr,
                            write: this.props.writeToStderr
                        } },
                        react_1.default.createElement(FocusContext_1.default.Provider, { value: {
                                activeId: this.state.activeFocusId,
                                add: this.addFocusable,
                                remove: this.removeFocusable,
                                activate: this.activateFocusable,
                                deactivate: this.deactivateFocusable,
                                enableFocus: this.enableFocus,
                                disableFocus: this.disableFocus,
                                focusNext: this.focusNext,
                                focusPrevious: this.focusPrevious,
                                focus: this.focus
                            } }, this.state.error ? (react_1.default.createElement(ErrorOverview_1.default, { error: this.state.error })) : (this.props.children)))))));
    }
    componentDidMount() {
        cli_cursor_1.default.hide(this.props.stdout);
    }
    componentWillUnmount() {
        cli_cursor_1.default.show(this.props.stdout);
        // ignore calling setRawMode on an handle stdin it cannot be called
        if (this.isRawModeSupported()) {
            this.handleSetRawMode(false);
        }
    }
    componentDidCatch(error) {
        this.handleExit(error);
    }
}
exports.default = App;
App.displayName = 'InternalApp';
//# sourceMappingURL=App.js.map