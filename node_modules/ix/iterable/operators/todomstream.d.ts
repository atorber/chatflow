import { ReadableBYOBStreamOptions, ReadableByteStreamOptions } from '../../asynciterable/todomstream';
import { UnaryFunction } from '../../interfaces';
export declare function toDOMStream<T>(strategy?: QueuingStrategy<T>): UnaryFunction<Iterable<T>, ReadableStream<T>>;
export declare function toDOMStream<T>(options: ReadableBYOBStreamOptions<Uint8Array>): UnaryFunction<Iterable<T>, ReadableStream<Uint8Array>>;
export declare function toDOMStream<T>(options: ReadableByteStreamOptions<Uint8Array>): UnaryFunction<Iterable<T>, ReadableStream<Uint8Array>>;
