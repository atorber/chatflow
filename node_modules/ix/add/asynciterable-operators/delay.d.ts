import { AsyncIterableX } from '../../asynciterable/asynciterablex';
export declare function delayProto<TSource>(this: AsyncIterableX<TSource>, dueTime: number): AsyncIterableX<TSource>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        delay: typeof delayProto;
    }
}
