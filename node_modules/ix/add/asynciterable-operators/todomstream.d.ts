import { ReadableBYOBStreamOptions, ReadableByteStreamOptions } from '../../asynciterable/todomstream';
/**
 * @ignore
 */
export declare function toDOMStreamProto<T>(this: AsyncIterable<T>, strategy?: QueuingStrategy<T>): ReadableStream<T>;
export declare function toDOMStreamProto<T>(this: AsyncIterable<T>, options: ReadableBYOBStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
export declare function toDOMStreamProto<T>(this: AsyncIterable<T>, options: ReadableByteStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toDOMStream: typeof toDOMStreamProto;
    }
}
