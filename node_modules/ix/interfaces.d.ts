/// <reference types="node" />
import { IterableX } from './iterable';
import { AsyncIterableX } from './asynciterable';
export declare type UnaryFunction<T, R> = (source: T) => R;
export declare type OperatorFunction<T, R> = UnaryFunction<Iterable<T>, IterableX<R>>;
export declare type OperatorAsyncFunction<T, R> = UnaryFunction<AsyncIterable<T>, AsyncIterableX<R>>;
export declare type MonoTypeOperatorFunction<T> = OperatorFunction<T, T>;
export declare type MonoTypeOperatorAsyncFunction<T> = OperatorAsyncFunction<T, T>;
/** @ignore */
export declare type BufferLike = string | Buffer | Uint8Array;
