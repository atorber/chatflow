import { ExtremaOptions } from '../../asynciterable/extremaoptions';
export declare function maxProto<TSource, TResult = TSource>(this: AsyncIterable<TSource>, options?: ExtremaOptions<TSource, TResult>): Promise<TResult>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        max: typeof maxProto;
    }
}
