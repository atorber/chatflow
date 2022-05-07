import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function onErrorResumeNextProto<TSource>(this: AsyncIterableX<TSource>, ...args: AsyncIterable<TSource>[]): AsyncIterableX<TSource>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        onErrorResumeNext: typeof onErrorResumeNextProto;
    }
}
