import { AsyncIterableX } from '../../asynciterable/asynciterablex';
export declare function delayEachProto<TSource>(this: AsyncIterableX<TSource>, dueTime: number): AsyncIterableX<TSource>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        delayEach: typeof delayEachProto;
    }
}
