/// <reference types="node" />
import { ReadableOptions } from 'stream';
import { BufferLike } from '../../interfaces';
import { AsyncIterableReadable } from '../../asynciterable/tonodestream';
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
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toNodeStream: typeof toNodeStreamProto;
    }
}
