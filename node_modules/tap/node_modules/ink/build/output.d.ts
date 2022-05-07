import { OutputTransformer } from './render-node-to-output';
/**
 * "Virtual" output class
 *
 * Handles the positioning and saving of the output of each node in the tree.
 * Also responsible for applying transformations to each character of the output.
 *
 * Used to generate the final output of all nodes before writing it to actual output stream (e.g. stdout)
 */
interface Options {
    width: number;
    height: number;
}
export default class Output {
    width: number;
    height: number;
    private readonly writes;
    constructor(options: Options);
    write(x: number, y: number, text: string, options: {
        transformers: OutputTransformer[];
    }): void;
    get(): {
        output: string;
        height: number;
    };
}
export {};
