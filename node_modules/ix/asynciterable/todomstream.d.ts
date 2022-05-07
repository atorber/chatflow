export declare type ReadableBYOBStreamOptions<T = any> = QueuingStrategy<T> & {
    type: 'bytes';
};
export declare type ReadableByteStreamOptions<T = any> = QueuingStrategy<T> & {
    type: 'bytes';
    autoAllocateChunkSize?: number;
};
/**
 * Converts an async-iterable instance to a DOM stream.
 * @param source The source async-iterable to convert to a DOM stream.
 * @param strategy The queueing strategy to apply to the DOM stream.
 */
export declare function toDOMStream<T>(source: AsyncIterable<T>, strategy?: QueuingStrategy<T>): ReadableStream<T>;
/**
 * Converts an async-iterable stream to a DOM stream.
 * @param source The async-iterable stream to convert to a DOM stream.
 * @param options The ReadableBYOBStreamOptions to apply to the DOM stream.
 */
export declare function toDOMStream<T>(source: AsyncIterable<T>, options: ReadableBYOBStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
/**
 * Converts an async-iterable stream to a DOM stream.
 * @param source The async-iterable stream to convert to a DOM stream.
 * @param options The ReadableByteStreamOptions to apply to the DOM stream.
 */
export declare function toDOMStream<T>(source: AsyncIterable<T>, options: ReadableByteStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
/**
 * @ignore
 */
export declare function toDOMStreamProto<T>(this: AsyncIterable<T>, strategy?: QueuingStrategy<T>): ReadableStream<T>;
export declare function toDOMStreamProto<T>(this: AsyncIterable<T>, options: ReadableBYOBStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
export declare function toDOMStreamProto<T>(this: AsyncIterable<T>, options: ReadableByteStreamOptions<Uint8Array>): ReadableStream<Uint8Array>;
declare module '../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toDOMStream: typeof toDOMStreamProto;
        tee(): [ReadableStream<T>, ReadableStream<T>];
        pipeTo(writable: WritableStream<T>, options?: StreamPipeOptions): Promise<void>;
        pipeThrough<R extends ReadableStream<any>>(duplex: {
            writable: WritableStream<T>;
            readable: R;
        }, options?: StreamPipeOptions): R;
    }
}
