import { ExtremaOptions } from '../../asynciterable/extremaoptions';
/**
 * @ignore
 */
export declare function minByProto<TSource, TKey>(this: AsyncIterable<TSource>, options?: ExtremaOptions<TSource, TKey>): Promise<TSource[]>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        minBy: typeof minByProto;
    }
}
