/// <reference types="yoga-layout" />
import Yoga from 'yoga-layout-prebuilt';
import { Styles } from './styles';
import { OutputTransformer } from './render-node-to-output';
interface InkNode {
    parentNode: DOMElement | null;
    yogaNode?: Yoga.YogaNode;
    internal_static?: boolean;
    style: Styles;
}
export declare const TEXT_NAME = "#text";
export declare type TextName = '#text';
export declare type ElementNames = 'ink-root' | 'ink-box' | 'ink-text' | 'ink-virtual-text';
export declare type NodeNames = ElementNames | TextName;
export declare type DOMElement = {
    nodeName: ElementNames;
    attributes: {
        [key: string]: DOMNodeAttribute;
    };
    childNodes: DOMNode[];
    internal_transform?: OutputTransformer;
    isStaticDirty?: boolean;
    staticNode?: any;
    onRender?: () => void;
    onImmediateRender?: () => void;
} & InkNode;
export declare type TextNode = {
    nodeName: TextName;
    nodeValue: string;
} & InkNode;
export declare type DOMNode<T = {
    nodeName: NodeNames;
}> = T extends {
    nodeName: infer U;
} ? U extends '#text' ? TextNode : DOMElement : never;
export declare type DOMNodeAttribute = boolean | string | number;
export declare const createNode: (nodeName: ElementNames) => DOMElement;
export declare const appendChildNode: (node: DOMElement, childNode: DOMElement) => void;
export declare const insertBeforeNode: (node: DOMElement, newChildNode: DOMNode, beforeChildNode: DOMNode) => void;
export declare const removeChildNode: (node: DOMElement, removeNode: DOMNode) => void;
export declare const setAttribute: (node: DOMElement, key: string, value: DOMNodeAttribute) => void;
export declare const setStyle: (node: DOMNode, style: Styles) => void;
export declare const createTextNode: (text: string) => TextNode;
export declare const setTextNodeValue: (node: TextNode, text: string) => void;
export {};
