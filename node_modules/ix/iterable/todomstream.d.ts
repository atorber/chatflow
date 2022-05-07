import { ReadableBYOBStreamOptions, ReadableByteStreamOptions } from '../asynciterable/todomstream';
export declare function toDOMStream<T>(source: Iterable<T>, strategy?: QueuingStrategy<T>): ReadableStream<T>;
export declare function toDOMStream<T>(source: Iterable<T>, options: ReadableBYOBStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
export declare function toDOMStream<T>(source: Iterable<T>, options: ReadableByteStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
/**
 * @ignore
 */
export declare function toDOMStreamProto<T>(this: Iterable<T>, strategy?: QueuingStrategy<T>): ReadableStream<T>;
export declare function toDOMStreamProto<T>(this: Iterable<T>, options: ReadableBYOBStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
export declare function toDOMStreamProto<T>(this: Iterable<T>, options: ReadableByteStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
declare module '../iterable/iterablex' {
    interface IterableX<T> {
        toDOMStream: typeof toDOMStreamProto;
        tee(): [ReadableStream<T>, ReadableStream<T>];
        pipeTo(writable: WritableStream<T>, options?: StreamPipeOptions): Promise<void>;
        pipeThrough<R extends ReadableStream<any>>(duplex: {
            writable: WritableStream<T>;
            readable: R;
        }, options?: StreamPipeOptions): R;
    }
}
