import { AsyncIterableX } from './asynciterablex';
export declare class AsyncIterableReadableStream<T> extends AsyncIterableX<T | undefined> {
    protected _stream: ReadableStream<T>;
    constructor(_stream: ReadableStream<T>);
    [Symbol.asyncIterator](): AsyncIterator<T, any, undefined>;
}
export declare class AsyncIterableReadableByteStream extends AsyncIterableReadableStream<Uint8Array> {
    [Symbol.asyncIterator](): AsyncIterator<Uint8Array, any, undefined>;
}
/**
 * Creates an async-iterable from an existing DOM stream.
 *
 * @template TSource The type of elements in the source DOM stream.
 * @param {ReadableStream<TSource>} stream The DOM Readable stream to convert to an async-iterable.
 * @returns {AsyncIterableX<TSource>} An async-iterable containing the elements from the ReadableStream.
 */
export declare function fromDOMStream<TSource>(stream: ReadableStream<TSource>): AsyncIterableX<TSource>;
/**
 * Creates an async-iterable from an existing DOM stream and options.
 *
 * @template TSource  * @template TSource The type of elements in the source DOM stream.
 * @param {ReadableStream<TSource>} stream The readable stream to convert to an async-iterable.
 * @param {{ mode: 'byob' }} options The options to set the mode for the DOM stream.
 * @returns {AsyncIterableX<TSource>} An async-iterable created from the incoming async-iterable.
 */
export declare function fromDOMStream<TSource extends ArrayBufferView>(stream: ReadableStream<TSource>, options: {
    mode: 'byob';
}): AsyncIterableX<TSource>;
