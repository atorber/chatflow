import { ToMapOptions } from '../../asynciterable/tomap';
export declare function toMapProto<TSource, TKey, TElement = TSource>(this: AsyncIterable<TSource>, options: ToMapOptions<TSource, TElement>): Promise<Map<TKey, TElement | TSource>>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toMap: typeof toMapProto;
    }
}
