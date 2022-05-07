"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_1 = require("scheduler");
const react_reconciler_1 = __importDefault(require("react-reconciler"));
const yoga_layout_prebuilt_1 = __importDefault(require("yoga-layout-prebuilt"));
const dom_1 = require("./dom");
// We need to conditionally perform devtools connection to avoid
// accidentally breaking other third-party code.
// See https://github.com/vadimdemedes/ink/issues/384
if (process.env.DEV === 'true') {
    // eslint-disable-next-line import/no-unassigned-import
    require('./devtools');
}
const cleanupYogaNode = (node) => {
    node === null || node === void 0 ? void 0 : node.unsetMeasureFunc();
    node === null || node === void 0 ? void 0 : node.freeRecursive();
};
exports.default = react_reconciler_1.default({
    // @ts-ignore
    schedulePassiveEffects: scheduler_1.unstable_scheduleCallback,
    cancelPassiveEffects: scheduler_1.unstable_cancelCallback,
    now: Date.now,
    getRootHostContext: () => ({
        isInsideText: false
    }),
    prepareForCommit: () => null,
    preparePortalMount: () => null,
    clearContainer: () => false,
    shouldDeprioritizeSubtree: () => false,
    resetAfterCommit: rootNode => {
        // Since renders are throttled at the instance level and <Static> component children
        // are rendered only once and then get deleted, we need an escape hatch to
        // trigger an immediate render to ensure <Static> children are written to output before they get erased
        if (rootNode.isStaticDirty) {
            rootNode.isStaticDirty = false;
            if (typeof rootNode.onImmediateRender === 'function') {
                rootNode.onImmediateRender();
            }
            return;
        }
        if (typeof rootNode.onRender === 'function') {
            rootNode.onRender();
        }
    },
    getChildHostContext: (parentHostContext, type) => {
        const previousIsInsideText = parentHostContext.isInsideText;
        const isInsideText = type === 'ink-text' || type === 'ink-virtual-text';
        if (previousIsInsideText === isInsideText) {
            return parentHostContext;
        }
        return { isInsideText };
    },
    shouldSetTextContent: () => false,
    createInstance: (originalType, newProps, _root, hostContext) => {
        if (hostContext.isInsideText && originalType === 'ink-box') {
            throw new Error(`<Box> can’t be nested inside <Text> component`);
        }
        const type = originalType === 'ink-text' && hostContext.isInsideText
            ? 'ink-virtual-text'
            : originalType;
        const node = dom_1.createNode(type);
        for (const [key, value] of Object.entries(newProps)) {
            if (key === 'children') {
                continue;
            }
            else if (key === 'style') {
                dom_1.setStyle(node, value);
            }
            else if (key === 'internal_transform') {
                node.internal_transform = value;
            }
            else if (key === 'internal_static') {
                node.internal_static = true;
            }
            else {
                dom_1.setAttribute(node, key, value);
            }
        }
        return node;
    },
    createTextInstance: (text, _root, hostContext) => {
        if (!hostContext.isInsideText) {
            throw new Error(`Text string "${text}" must be rendered inside <Text> component`);
        }
        return dom_1.createTextNode(text);
    },
    resetTextContent: () => { },
    hideTextInstance: node => {
        dom_1.setTextNodeValue(node, '');
    },
    unhideTextInstance: (node, text) => {
        dom_1.setTextNodeValue(node, text);
    },
    getPublicInstance: instance => instance,
    hideInstance: node => {
        var _a;
        (_a = node.yogaNode) === null || _a === void 0 ? void 0 : _a.setDisplay(yoga_layout_prebuilt_1.default.DISPLAY_NONE);
    },
    unhideInstance: node => {
        var _a;
        (_a = node.yogaNode) === null || _a === void 0 ? void 0 : _a.setDisplay(yoga_layout_prebuilt_1.default.DISPLAY_FLEX);
    },
    appendInitialChild: dom_1.appendChildNode,
    appendChild: dom_1.appendChildNode,
    insertBefore: dom_1.insertBeforeNode,
    finalizeInitialChildren: (node, _type, _props, rootNode) => {
        if (node.internal_static) {
            rootNode.isStaticDirty = true;
            // Save reference to <Static> node to skip traversal of entire
            // node tree to find it
            rootNode.staticNode = node;
        }
        return false;
    },
    supportsMutation: true,
    appendChildToContainer: dom_1.appendChildNode,
    insertInContainerBefore: dom_1.insertBeforeNode,
    removeChildFromContainer: (node, removeNode) => {
        dom_1.removeChildNode(node, removeNode);
        cleanupYogaNode(removeNode.yogaNode);
    },
    prepareUpdate: (node, _type, oldProps, newProps, rootNode) => {
        if (node.internal_static) {
            rootNode.isStaticDirty = true;
        }
        const updatePayload = {};
        const keys = Object.keys(newProps);
        for (const key of keys) {
            if (newProps[key] !== oldProps[key]) {
                const isStyle = key === 'style' &&
                    typeof newProps.style === 'object' &&
                    typeof oldProps.style === 'object';
                if (isStyle) {
                    const newStyle = newProps.style;
                    const oldStyle = oldProps.style;
                    const styleKeys = Object.keys(newStyle);
                    for (const styleKey of styleKeys) {
                        // Always include `borderColor` and `borderStyle` to ensure border is rendered,
                        // otherwise resulting `updatePayload` may not contain them
                        // if they weren't changed during this update
                        if (styleKey === 'borderStyle' || styleKey === 'borderColor') {
                            if (typeof updatePayload.style !== 'object') {
                                // Linter didn't like `= {} as Style`
                                const style = {};
                                updatePayload.style = style;
                            }
                            updatePayload.style.borderStyle = newStyle.borderStyle;
                            updatePayload.style.borderColor = newStyle.borderColor;
                        }
                        if (newStyle[styleKey] !== oldStyle[styleKey]) {
                            if (typeof updatePayload.style !== 'object') {
                                // Linter didn't like `= {} as Style`
                                const style = {};
                                updatePayload.style = style;
                            }
                            updatePayload.style[styleKey] = newStyle[styleKey];
                        }
                    }
                    continue;
                }
                updatePayload[key] = newProps[key];
            }
        }
        return updatePayload;
    },
    commitUpdate: (node, updatePayload) => {
        for (const [key, value] of Object.entries(updatePayload)) {
            if (key === 'children') {
                continue;
            }
            else if (key === 'style') {
                dom_1.setStyle(node, value);
            }
            else if (key === 'internal_transform') {
                node.internal_transform = value;
            }
            else if (key === 'internal_static') {
                node.internal_static = true;
            }
            else {
                dom_1.setAttribute(node, key, value);
            }
        }
    },
    commitTextUpdate: (node, _oldText, newText) => {
        dom_1.setTextNodeValue(node, newText);
    },
    removeChild: (node, removeNode) => {
        dom_1.removeChildNode(node, removeNode);
        cleanupYogaNode(removeNode.yogaNode);
    }
});
//# sourceMappingURL=reconciler.js.map