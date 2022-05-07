import { DOMElement } from './dom';
interface Result {
    output: string;
    outputHeight: number;
    staticOutput: string;
}
declare const _default: (node: DOMElement, terminalWidth: number) => Result;
export default _default;
