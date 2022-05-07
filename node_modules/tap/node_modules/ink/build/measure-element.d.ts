import { DOMElement } from './dom';
interface Output {
    /**
     * Element width.
     */
    width: number;
    /**
     * Element height.
     */
    height: number;
}
declare const _default: (node: DOMElement) => Output;
/**
 * Measure the dimensions of a particular `<Box>` element.
 */
export default _default;
