import { AsyncIterableX } from '../../asynciterable/asynciterablex';
export declare function memoizeProto<T>(this: AsyncIterableX<T>, readerCount?: number): AsyncIterableX<T>;
export declare function memoizeProto<T, R>(this: AsyncIterableX<T>, readerCount?: number, selector?: (value: AsyncIterable<T>, signal?: AbortSignal) => AsyncIterable<R>): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        memoize: typeof memoizeProto;
    }
}
