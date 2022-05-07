/// <reference types="node" />
import { BufferLike } from '../interfaces';
import { Readable, ReadableOptions } from 'stream';
declare type SourceIterator<TSource> = Iterator<TSource, any, number | ArrayBufferView | undefined | null>;
export declare class IterableReadable<T> extends Readable {
    private _pulling;
    private _objectMode;
    private _iterator;
    constructor(source: Iterable<T>, options?: ReadableOptions);
    _read(size: number): void;
    _destroy(err: Error | null, cb: (err: Error | null) => void): void;
    _pull(it: SourceIterator<T>, size: number): boolean;
}
export declare function toNodeStream<TSource>(source: Iterable<TSource>): IterableReadable<TSource>;
export declare function toNodeStream<TSource>(source: Iterable<TSource>, options: ReadableOptions & {
    objectMode: true;
}): IterableReadable<TSource>;
export declare function toNodeStream<TSource extends BufferLike>(source: Iterable<TSource>, options: ReadableOptions & {
    objectMode: false;
}): IterableReadable<TSource>;
/**
 * @ignore
 */
export declare function toNodeStreamProto<TSource>(this: Iterable<TSource>): IterableReadable<TSource>;
export declare function toNodeStreamProto<TSource>(this: Iterable<TSource>, options: ReadableOptions | {
    objectMode: true;
}): IterableReadable<TSource>;
export declare function toNodeStreamProto<TSource extends BufferLike>(this: Iterable<TSource>, options: ReadableOptions | {
    objectMode: false;
}): IterableReadable<TSource>;
declare module '../iterable/iterablex' {
    interface IterableX<T> {
        toNodeStream: typeof toNodeStreamProto;
    }
}
export {};
