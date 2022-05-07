/// <reference types="node" />
import { AsyncIterableX } from './asynciterablex';
import { OperatorAsyncFunction, UnaryFunction } from '../interfaces';
import { Transform, TransformCallback, TransformOptions } from 'stream';
export interface AsyncIterableTransform<T> extends AsyncIterableX<T>, Transform {
    pipe<R>(...operations: UnaryFunction<AsyncIterable<T>, R>[]): R;
    pipe<R>(...operations: OperatorAsyncFunction<T, R>[]): AsyncIterableX<R>;
    pipe<R extends NodeJS.WritableStream>(writable: R, options?: {
        end?: boolean;
    }): R;
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}
declare const asyncIterableMixin: unique symbol;
export declare class AsyncIterableTransform<T> extends Transform {
    private static [asyncIterableMixin];
    constructor(options?: TransformOptions);
    /** @nocollapse */
    _flush(callback: TransformCallback): void;
    /** @nocollapse */
    _transform(chunk: any, _encoding: string, callback: TransformCallback): void;
}
export declare function asAsyncIterable<T>(options?: TransformOptions): AsyncIterableTransform<T>;
export {};
