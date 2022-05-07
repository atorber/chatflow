"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AppContext_1 = __importDefault(require("../components/AppContext"));
/**
 * `useApp` is a React hook, which exposes a method to manually exit the app (unmount).
 */
const useApp = () => react_1.useContext(AppContext_1.default);
exports.default = useApp;
//# sourceMappingURL=use-app.js.map