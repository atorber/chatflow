import { DOMElement } from './dom';
import Output from './output';
export declare type OutputTransformer = (s: string) => string;
declare const renderNodeToOutput: (node: DOMElement, output: Output, options: {
    offsetX?: number;
    offsetY?: number;
    transformers?: OutputTransformer[];
    skipStaticElements: boolean;
}) => void;
export default renderNodeToOutput;
