/// <reference types="node" />
import { ReadableOptions } from 'stream';
import { IterableReadable } from '../../iterable/tonodestream';
import { BufferLike, UnaryFunction } from '../../interfaces';
export declare function toNodeStream<TSource>(): UnaryFunction<Iterable<TSource>, IterableReadable<TSource>>;
export declare function toNodeStream<TSource>(options: ReadableOptions & {
    objectMode: true;
}): UnaryFunction<Iterable<TSource>, IterableReadable<TSource>>;
export declare function toNodeStream<TSource extends BufferLike>(options: ReadableOptions & {
    objectMode: false;
}): UnaryFunction<Iterable<TSource>, IterableReadable<TSource>>;
