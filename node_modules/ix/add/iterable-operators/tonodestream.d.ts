/// <reference types="node" />
import { ReadableOptions } from 'stream';
import { BufferLike } from '../../interfaces';
import { IterableReadable } from '../../iterable/tonodestream';
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
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        toNodeStream: typeof toNodeStreamProto;
    }
}
