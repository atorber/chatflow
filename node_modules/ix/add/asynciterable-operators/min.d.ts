import { ExtremaOptions } from '../../asynciterable/extremaoptions';
export declare function minProto<TSource, TResult = TSource>(this: AsyncIterable<TSource>, options?: ExtremaOptions<TSource, TResult>): Promise<TResult>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        min: typeof minProto;
    }
}
