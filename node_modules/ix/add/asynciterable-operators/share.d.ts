import { AsyncIterableX } from '../../asynciterable/asynciterablex';
export declare function shareProto<TSource>(this: AsyncIterableX<TSource>): AsyncIterableX<TSource>;
export declare function shareProto<TSource, TResult>(this: AsyncIterableX<TSource>, selector?: (value: AsyncIterable<TSource>) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>): AsyncIterableX<TResult>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        share: typeof shareProto;
    }
}
