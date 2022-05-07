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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
const react_1 = __importStar(require("react"));
/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box = react_1.forwardRef((_a, ref) => {
    var { children } = _a, style = __rest(_a, ["children"]);
    const transformedStyle = Object.assign(Object.assign({}, style), { marginLeft: style.marginLeft || style.marginX || style.margin || 0, marginRight: style.marginRight || style.marginX || style.margin || 0, marginTop: style.marginTop || style.marginY || style.margin || 0, marginBottom: style.marginBottom || style.marginY || style.margin || 0, paddingLeft: style.paddingLeft || style.paddingX || style.padding || 0, paddingRight: style.paddingRight || style.paddingX || style.padding || 0, paddingTop: style.paddingTop || style.paddingY || style.padding || 0, paddingBottom: style.paddingBottom || style.paddingY || style.padding || 0 });
    return (react_1.default.createElement("ink-box", { ref: ref, style: transformedStyle }, children));
});
Box.displayName = 'Box';
Box.defaultProps = {
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 1
};
exports.default = Box;
//# sourceMappingURL=Box.js.map