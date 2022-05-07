"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
const yoga_layout_prebuilt_1 = __importDefault(require("yoga-layout-prebuilt"));
const applyPositionStyles = (node, style) => {
    if ('position' in style) {
        node.setPositionType(style.position === 'absolute'
            ? yoga_layout_prebuilt_1.default.POSITION_TYPE_ABSOLUTE
            : yoga_layout_prebuilt_1.default.POSITION_TYPE_RELATIVE);
    }
};
const applyMarginStyles = (node, style) => {
    if ('marginLeft' in style) {
        node.setMargin(yoga_layout_prebuilt_1.default.EDGE_START, style.marginLeft || 0);
    }
    if ('marginRight' in style) {
        node.setMargin(yoga_layout_prebuilt_1.default.EDGE_END, style.marginRight || 0);
    }
    if ('marginTop' in style) {
        node.setMargin(yoga_layout_prebuilt_1.default.EDGE_TOP, style.marginTop || 0);
    }
    if ('marginBottom' in style) {
        node.setMargin(yoga_layout_prebuilt_1.default.EDGE_BOTTOM, style.marginBottom || 0);
    }
};
const applyPaddingStyles = (node, style) => {
    if ('paddingLeft' in style) {
        node.setPadding(yoga_layout_prebuilt_1.default.EDGE_LEFT, style.paddingLeft || 0);
    }
    if ('paddingRight' in style) {
        node.setPadding(yoga_layout_prebuilt_1.default.EDGE_RIGHT, style.paddingRight || 0);
    }
    if ('paddingTop' in style) {
        node.setPadding(yoga_layout_prebuilt_1.default.EDGE_TOP, style.paddingTop || 0);
    }
    if ('paddingBottom' in style) {
        node.setPadding(yoga_layout_prebuilt_1.default.EDGE_BOTTOM, style.paddingBottom || 0);
    }
};
const applyFlexStyles = (node, style) => {
    var _a;
    if ('flexGrow' in style) {
        node.setFlexGrow((_a = style.flexGrow) !== null && _a !== void 0 ? _a : 0);
    }
    if ('flexShrink' in style) {
        node.setFlexShrink(typeof style.flexShrink === 'number' ? style.flexShrink : 1);
    }
    if ('flexDirection' in style) {
        if (style.flexDirection === 'row') {
            node.setFlexDirection(yoga_layout_prebuilt_1.default.FLEX_DIRECTION_ROW);
        }
        if (style.flexDirection === 'row-reverse') {
            node.setFlexDirection(yoga_layout_prebuilt_1.default.FLEX_DIRECTION_ROW_REVERSE);
        }
        if (style.flexDirection === 'column') {
            node.setFlexDirection(yoga_layout_prebuilt_1.default.FLEX_DIRECTION_COLUMN);
        }
        if (style.flexDirection === 'column-reverse') {
            node.setFlexDirection(yoga_layout_prebuilt_1.default.FLEX_DIRECTION_COLUMN_REVERSE);
        }
    }
    if ('flexBasis' in style) {
        if (typeof style.flexBasis === 'number') {
            node.setFlexBasis(style.flexBasis);
        }
        else if (typeof style.flexBasis === 'string') {
            node.setFlexBasisPercent(Number.parseInt(style.flexBasis, 10));
        }
        else {
            // This should be replaced with node.setFlexBasisAuto() when new Yoga release is out
            node.setFlexBasis(NaN);
        }
    }
    if ('alignItems' in style) {
        if (style.alignItems === 'stretch' || !style.alignItems) {
            node.setAlignItems(yoga_layout_prebuilt_1.default.ALIGN_STRETCH);
        }
        if (style.alignItems === 'flex-start') {
            node.setAlignItems(yoga_layout_prebuilt_1.default.ALIGN_FLEX_START);
        }
        if (style.alignItems === 'center') {
            node.setAlignItems(yoga_layout_prebuilt_1.default.ALIGN_CENTER);
        }
        if (style.alignItems === 'flex-end') {
            node.setAlignItems(yoga_layout_prebuilt_1.default.ALIGN_FLEX_END);
        }
    }
    if ('alignSelf' in style) {
        if (style.alignSelf === 'auto' || !style.alignSelf) {
            node.setAlignSelf(yoga_layout_prebuilt_1.default.ALIGN_AUTO);
        }
        if (style.alignSelf === 'flex-start') {
            node.setAlignSelf(yoga_layout_prebuilt_1.default.ALIGN_FLEX_START);
        }
        if (style.alignSelf === 'center') {
            node.setAlignSelf(yoga_layout_prebuilt_1.default.ALIGN_CENTER);
        }
        if (style.alignSelf === 'flex-end') {
            node.setAlignSelf(yoga_layout_prebuilt_1.default.ALIGN_FLEX_END);
        }
    }
    if ('justifyContent' in style) {
        if (style.justifyContent === 'flex-start' || !style.justifyContent) {
            node.setJustifyContent(yoga_layout_prebuilt_1.default.JUSTIFY_FLEX_START);
        }
        if (style.justifyContent === 'center') {
            node.setJustifyContent(yoga_layout_prebuilt_1.default.JUSTIFY_CENTER);
        }
        if (style.justifyContent === 'flex-end') {
            node.setJustifyContent(yoga_layout_prebuilt_1.default.JUSTIFY_FLEX_END);
        }
        if (style.justifyContent === 'space-between') {
            node.setJustifyContent(yoga_layout_prebuilt_1.default.JUSTIFY_SPACE_BETWEEN);
        }
        if (style.justifyContent === 'space-around') {
            node.setJustifyContent(yoga_layout_prebuilt_1.default.JUSTIFY_SPACE_AROUND);
        }
    }
};
const applyDimensionStyles = (node, style) => {
    var _a, _b;
    if ('width' in style) {
        if (typeof style.width === 'number') {
            node.setWidth(style.width);
        }
        else if (typeof style.width === 'string') {
            node.setWidthPercent(Number.parseInt(style.width, 10));
        }
        else {
            node.setWidthAuto();
        }
    }
    if ('height' in style) {
        if (typeof style.height === 'number') {
            node.setHeight(style.height);
        }
        else if (typeof style.height === 'string') {
            node.setHeightPercent(Number.parseInt(style.height, 10));
        }
        else {
            node.setHeightAuto();
        }
    }
    if ('minWidth' in style) {
        if (typeof style.minWidth === 'string') {
            node.setMinWidthPercent(Number.parseInt(style.minWidth, 10));
        }
        else {
            node.setMinWidth((_a = style.minWidth) !== null && _a !== void 0 ? _a : 0);
        }
    }
    if ('minHeight' in style) {
        if (typeof style.minHeight === 'string') {
            node.setMinHeightPercent(Number.parseInt(style.minHeight, 10));
        }
        else {
            node.setMinHeight((_b = style.minHeight) !== null && _b !== void 0 ? _b : 0);
        }
    }
};
const applyDisplayStyles = (node, style) => {
    if ('display' in style) {
        node.setDisplay(style.display === 'flex' ? yoga_layout_prebuilt_1.default.DISPLAY_FLEX : yoga_layout_prebuilt_1.default.DISPLAY_NONE);
    }
};
const applyBorderStyles = (node, style) => {
    if ('borderStyle' in style) {
        const borderWidth = typeof style.borderStyle === 'string' ? 1 : 0;
        node.setBorder(yoga_layout_prebuilt_1.default.EDGE_TOP, borderWidth);
        node.setBorder(yoga_layout_prebuilt_1.default.EDGE_BOTTOM, borderWidth);
        node.setBorder(yoga_layout_prebuilt_1.default.EDGE_LEFT, borderWidth);
        node.setBorder(yoga_layout_prebuilt_1.default.EDGE_RIGHT, borderWidth);
    }
};
exports.default = (node, style = {}) => {
    applyPositionStyles(node, style);
    applyMarginStyles(node, style);
    applyPaddingStyles(node, style);
    applyFlexStyles(node, style);
    applyDimensionStyles(node, style);
    applyDisplayStyles(node, style);
    applyBorderStyles(node, style);
};
//# sourceMappingURL=styles.js.map