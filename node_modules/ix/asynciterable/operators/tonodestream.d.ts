/// <reference types="node" />
import { ReadableOptions } from 'stream';
import { AsyncIterableReadable } from '../tonodestream';
import { BufferLike, UnaryFunction } from '../../interfaces';
export declare function toNodeStream<TSource>(): UnaryFunction<AsyncIterable<TSource>, AsyncIterableReadable<TSource>>;
export declare function toNodeStream<TSource>(options: ReadableOptions & {
    objectMode: true;
}): UnaryFunction<AsyncIterable<TSource>, AsyncIterableReadable<TSource>>;
export declare function toNodeStream<TSource extends BufferLike>(options: ReadableOptions & {
    objectMode: false;
}): UnaryFunction<AsyncIterable<TSource>, AsyncIterableReadable<TSource>>;
