import { AsyncIterableX } from '../../asynciterable/asynciterablex';
export declare function publishProto<TSource>(this: AsyncIterableX<TSource>): AsyncIterableX<TSource>;
export declare function publishProto<TSource, TResult>(this: AsyncIterableX<TSource>, selector?: (value: AsyncIterable<TSource>) => AsyncIterable<TResult>): AsyncIterableX<TResult>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        publish: typeof publishProto;
    }
}
