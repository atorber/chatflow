/// <reference types="node" />
import { BufferLike } from '../interfaces';
import { Readable, ReadableOptions } from 'stream';
declare type AsyncSourceIterator<TSource> = AsyncIterator<TSource, any, number | ArrayBufferView | undefined | null>;
export declare class AsyncIterableReadable<T> extends Readable {
    private _pulling;
    private _objectMode;
    private _iterator;
    constructor(source: AsyncIterable<T>, options?: ReadableOptions);
    _read(size: number): void;
    _destroy(err: Error | null, cb: (err: Error | null) => void): void;
    _pull(it: AsyncSourceIterator<T>, size: number): Promise<boolean>;
}
/**
 * Converts an existing async-iterable to a Node.js stream.
 * @param source The async-iterable to convert to a Node.js stream.
 * @param options The optional Readable options for the Node.js stream.
 */
export declare function toNodeStream<TSource>(source: AsyncIterable<TSource>): AsyncIterableReadable<TSource>;
export declare function toNodeStream<TSource>(source: AsyncIterable<TSource>, options: ReadableOptions & {
    objectMode: true;
}): AsyncIterableReadable<TSource>;
export declare function toNodeStream<TSource extends BufferLike>(source: AsyncIterable<TSource>, options: ReadableOptions & {
    objectMode: false;
}): AsyncIterableReadable<TSource>;
/**
 * @ignore
 */
export declare function toNodeStreamProto<TSource>(this: AsyncIterable<TSource>): AsyncIterableReadable<TSource>;
export declare function toNodeStreamProto<TSource>(this: AsyncIterable<TSource>, options: ReadableOptions & {
    objectMode: true;
}): AsyncIterableReadable<TSource>;
export declare function toNodeStreamProto<TSource extends BufferLike>(this: AsyncIterable<TSource>, options: ReadableOptions & {
    objectMode: false;
}): AsyncIterableReadable<TSource>;
declare module '../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toNodeStream: typeof toNodeStreamProto;
    }
}
export {};
