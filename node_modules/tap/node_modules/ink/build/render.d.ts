/// <reference types="node" />
import { ReactElement } from 'react';
import Ink from './ink';
export interface RenderOptions {
    /**
     * Output stream where app will be rendered.
     *
     * @default process.stdout
     */
    stdout?: NodeJS.WriteStream;
    /**
     * Input stream where app will listen for input.
     *
     * @default process.stdin
     */
    stdin?: NodeJS.ReadStream;
    /**
     * Error stream.
     * @default process.stderr
     */
    stderr?: NodeJS.WriteStream;
    /**
     * If true, each update will be rendered as a separate output, without replacing the previous one.
     *
     * @default false
     */
    debug?: boolean;
    /**
     * Configure whether Ink should listen to Ctrl+C keyboard input and exit the app. This is needed in case `process.stdin` is in raw mode, because then Ctrl+C is ignored by default and process is expected to handle it manually.
     *
     * @default true
     */
    exitOnCtrlC?: boolean;
    /**
     * Patch console methods to ensure console output doesn't mix with Ink output.
     *
     * @default true
     */
    patchConsole?: boolean;
}
export interface Instance {
    /**
     * Replace previous root node with a new one or update props of the current root node.
     */
    rerender: Ink['render'];
    /**
     * Manually unmount the whole Ink app.
     */
    unmount: Ink['unmount'];
    /**
     * Returns a promise, which resolves when app is unmounted.
     */
    waitUntilExit: Ink['waitUntilExit'];
    cleanup: () => void;
    /**
     * Clear output.
     */
    clear: () => void;
}
declare type RenderFunction = <Props, K extends NodeJS.WriteStream | RenderOptions>(tree: ReactElement<Props>, options?: K) => Instance;
/**
 * Mount a component and render the output.
 */
declare const render: RenderFunction;
export default render;
