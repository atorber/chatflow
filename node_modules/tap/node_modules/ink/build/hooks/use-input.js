"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_stdin_1 = __importDefault(require("./use-stdin"));
/**
 * This hook is used for handling user input.
 * It's a more convenient alternative to using `StdinContext` and listening to `data` events.
 * The callback you pass to `useInput` is called for each character when user enters any input.
 * However, if user pastes text and it's more than one character, the callback will be called only once and the whole string will be passed as `input`.
 *
 * ```
 * import {useInput} from 'ink';
 *
 * const UserInput = () => {
 *   useInput((input, key) => {
 *     if (input === 'q') {
 *       // Exit program
 *     }
 *
 *     if (key.leftArrow) {
 *       // Left arrow key pressed
 *     }
 *   });
 *
 *   return …
 * };
 * ```
 */
const useInput = (inputHandler, options = {}) => {
    const { stdin, setRawMode, internal_exitOnCtrlC } = use_stdin_1.default();
    react_1.useEffect(() => {
        if (options.isActive === false) {
            return;
        }
        setRawMode(true);
        return () => {
            setRawMode(false);
        };
    }, [options.isActive, setRawMode]);
    react_1.useEffect(() => {
        if (options.isActive === false) {
            return;
        }
        const handleData = (data) => {
            let input = String(data);
            const key = {
                upArrow: input === '\u001B[A',
                downArrow: input === '\u001B[B',
                leftArrow: input === '\u001B[D',
                rightArrow: input === '\u001B[C',
                pageDown: input === '\u001B[6~',
                pageUp: input === '\u001B[5~',
                return: input === '\r',
                escape: input === '\u001B',
                ctrl: false,
                shift: false,
                tab: input === '\t' || input === '\u001B[Z',
                backspace: input === '\u0008',
                delete: input === '\u007F' || input === '\u001B[3~',
                meta: false
            };
            // Copied from `keypress` module
            if (input <= '\u001A' && !key.return) {
                input = String.fromCharCode(input.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
                key.ctrl = true;
            }
            if (input.startsWith('\u001B')) {
                input = input.slice(1);
                key.meta = true;
            }
            const isLatinUppercase = input >= 'A' && input <= 'Z';
            const isCyrillicUppercase = input >= 'А' && input <= 'Я';
            if (input.length === 1 && (isLatinUppercase || isCyrillicUppercase)) {
                key.shift = true;
            }
            // Shift+Tab
            if (key.tab && input === '[Z') {
                key.shift = true;
            }
            if (key.tab || key.backspace || key.delete) {
                input = '';
            }
            // If app is not supposed to exit on Ctrl+C, then let input listener handle it
            if (!(input === 'c' && key.ctrl) || !internal_exitOnCtrlC) {
                inputHandler(input, key);
            }
        };
        stdin === null || stdin === void 0 ? void 0 : stdin.on('data', handleData);
        return () => {
            stdin === null || stdin === void 0 ? void 0 : stdin.off('data', handleData);
        };
    }, [options.isActive, stdin, internal_exitOnCtrlC, inputHandler]);
};
exports.default = useInput;
//# sourceMappingURL=use-input.js.map