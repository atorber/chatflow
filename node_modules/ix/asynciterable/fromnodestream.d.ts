/// <reference types="node" />
import { AsyncIterableX } from './asynciterablex';
export declare class ReadableStreamAsyncIterable extends AsyncIterableX<string | Buffer> implements AsyncIterator<string | Buffer> {
    private _stream;
    private _defaultSize?;
    private _state;
    private _error;
    private _rejectFns;
    private _endPromise;
    constructor(stream: NodeJS.ReadableStream, size?: number);
    [Symbol.asyncIterator](): AsyncIterator<string | Buffer>;
    next(size?: number | undefined): Promise<IteratorResult<string | Buffer>>;
    private _waitReadable;
    private _waitEnd;
}
/**
 * Creates a new async-iterable from a Node.js stream.
 *
 * @param {NodeJS.ReadableStream} stream The Node.js stream to convert to an async-iterable.
 * @param {number} [size] The size of the buffers for the stream.
 * @returns {(AsyncIterableX<string | Buffer>)} An async-iterable containing data from the stream either in string or Buffer format.
 */
export declare function fromNodeStream(stream: NodeJS.ReadableStream, size?: number): AsyncIterableX<string | Buffer>;
