/// <reference types="node" />
import { Writable } from 'stream';
export interface LogUpdate {
    clear: () => void;
    done: () => void;
    (str: string): void;
}
declare const _default: {
    create: (stream: Writable, { showCursor }?: {
        showCursor?: boolean | undefined;
    }) => LogUpdate;
};
export default _default;
