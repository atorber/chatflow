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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
/**
 * `<Static>` component permanently renders its output above everything else.
 * It's useful for displaying activity like completed tasks or logs - things that
 * are not changing after they're rendered (hence the name "Static").
 *
 * It's preferred to use `<Static>` for use cases like these, when you can't know
 * or control the amount of items that need to be rendered.
 *
 * For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display
 * a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it
 * to display a list of generated pages, while still displaying a live progress bar.
 */
const Static = (props) => {
    const { items, children: render, style: customStyle } = props;
    const [index, setIndex] = react_1.useState(0);
    const itemsToRender = react_1.useMemo(() => {
        return items.slice(index);
    }, [items, index]);
    react_1.useLayoutEffect(() => {
        setIndex(items.length);
    }, [items.length]);
    const children = itemsToRender.map((item, itemIndex) => {
        return render(item, index + itemIndex);
    });
    const style = react_1.useMemo(() => (Object.assign({ position: 'absolute', flexDirection: 'column' }, customStyle)), [customStyle]);
    return (react_1.default.createElement("ink-box", { 
        // @ts-ignore
        internal_static: true, style: style }, children));
};
Static.displayName = 'Static';
exports.default = Static;
//# sourceMappingURL=Static.js.map