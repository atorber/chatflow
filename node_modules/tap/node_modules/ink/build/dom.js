"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTextNodeValue = exports.createTextNode = exports.setStyle = exports.setAttribute = exports.removeChildNode = exports.insertBeforeNode = exports.appendChildNode = exports.createNode = exports.TEXT_NAME = void 0;
const yoga_layout_prebuilt_1 = __importDefault(require("yoga-layout-prebuilt"));
const measure_text_1 = __importDefault(require("./measure-text"));
const styles_1 = __importDefault(require("./styles"));
const wrap_text_1 = __importDefault(require("./wrap-text"));
const squash_text_nodes_1 = __importDefault(require("./squash-text-nodes"));
exports.TEXT_NAME = '#text';
exports.createNode = (nodeName) => {
    var _a;
    const node = {
        nodeName,
        style: {},
        attributes: {},
        childNodes: [],
        parentNode: null,
        yogaNode: nodeName === 'ink-virtual-text' ? undefined : yoga_layout_prebuilt_1.default.Node.create()
    };
    if (nodeName === 'ink-text') {
        (_a = node.yogaNode) === null || _a === void 0 ? void 0 : _a.setMeasureFunc(measureTextNode.bind(null, node));
    }
    return node;
};
exports.appendChildNode = (node, childNode) => {
    var _a;
    if (childNode.parentNode) {
        exports.removeChildNode(childNode.parentNode, childNode);
    }
    childNode.parentNode = node;
    node.childNodes.push(childNode);
    if (childNode.yogaNode) {
        (_a = node.yogaNode) === null || _a === void 0 ? void 0 : _a.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
    }
    if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
        markNodeAsDirty(node);
    }
};
exports.insertBeforeNode = (node, newChildNode, beforeChildNode) => {
    var _a, _b;
    if (newChildNode.parentNode) {
        exports.removeChildNode(newChildNode.parentNode, newChildNode);
    }
    newChildNode.parentNode = node;
    const index = node.childNodes.indexOf(beforeChildNode);
    if (index >= 0) {
        node.childNodes.splice(index, 0, newChildNode);
        if (newChildNode.yogaNode) {
            (_a = node.yogaNode) === null || _a === void 0 ? void 0 : _a.insertChild(newChildNode.yogaNode, index);
        }
        return;
    }
    node.childNodes.push(newChildNode);
    if (newChildNode.yogaNode) {
        (_b = node.yogaNode) === null || _b === void 0 ? void 0 : _b.insertChild(newChildNode.yogaNode, node.yogaNode.getChildCount());
    }
    if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
        markNodeAsDirty(node);
    }
};
exports.removeChildNode = (node, removeNode) => {
    var _a, _b;
    if (removeNode.yogaNode) {
        (_b = (_a = removeNode.parentNode) === null || _a === void 0 ? void 0 : _a.yogaNode) === null || _b === void 0 ? void 0 : _b.removeChild(removeNode.yogaNode);
    }
    removeNode.parentNode = null;
    const index = node.childNodes.indexOf(removeNode);
    if (index >= 0) {
        node.childNodes.splice(index, 1);
    }
    if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
        markNodeAsDirty(node);
    }
};
exports.setAttribute = (node, key, value) => {
    node.attributes[key] = value;
};
exports.setStyle = (node, style) => {
    node.style = style;
    if (node.yogaNode) {
        styles_1.default(node.yogaNode, style);
    }
};
exports.createTextNode = (text) => {
    const node = {
        nodeName: '#text',
        nodeValue: text,
        yogaNode: undefined,
        parentNode: null,
        style: {}
    };
    exports.setTextNodeValue(node, text);
    return node;
};
const measureTextNode = function (node, width) {
    var _a, _b;
    const text = node.nodeName === '#text' ? node.nodeValue : squash_text_nodes_1.default(node);
    const dimensions = measure_text_1.default(text);
    // Text fits into container, no need to wrap
    if (dimensions.width <= width) {
        return dimensions;
    }
    // This is happening when <Box> is shrinking child nodes and Yoga asks
    // if we can fit this text node in a <1px space, so we just tell Yoga "no"
    if (dimensions.width >= 1 && width > 0 && width < 1) {
        return dimensions;
    }
    const textWrap = (_b = (_a = node.style) === null || _a === void 0 ? void 0 : _a.textWrap) !== null && _b !== void 0 ? _b : 'wrap';
    const wrappedText = wrap_text_1.default(text, width, textWrap);
    return measure_text_1.default(wrappedText);
};
const findClosestYogaNode = (node) => {
    var _a;
    if (!node || !node.parentNode) {
        return undefined;
    }
    return (_a = node.yogaNode) !== null && _a !== void 0 ? _a : findClosestYogaNode(node.parentNode);
};
const markNodeAsDirty = (node) => {
    // Mark closest Yoga node as dirty to measure text dimensions again
    const yogaNode = findClosestYogaNode(node);
    yogaNode === null || yogaNode === void 0 ? void 0 : yogaNode.markDirty();
};
exports.setTextNodeValue = (node, text) => {
    if (typeof text !== 'string') {
        text = String(text);
    }
    node.nodeValue = text;
    markNodeAsDirty(node);
};
//# sourceMappingURL=dom.js.map