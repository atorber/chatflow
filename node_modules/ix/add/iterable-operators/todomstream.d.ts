import { ReadableBYOBStreamOptions, ReadableByteStreamOptions } from '../../asynciterable/todomstream';
/**
 * @ignore
 */
export declare function toDOMStreamProto<T>(this: Iterable<T>, strategy?: QueuingStrategy<T>): ReadableStream<T>;
export declare function toDOMStreamProto<T>(this: Iterable<T>, options: ReadableBYOBStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
export declare function toDOMStreamProto<T>(this: Iterable<T>, options: ReadableByteStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        toDOMStream: typeof toDOMStreamProto;
    }
}
