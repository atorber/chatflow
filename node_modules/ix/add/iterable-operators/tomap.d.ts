import { IterableX } from '../../iterable/iterablex';
import { ToMapOptions } from '../../iterable/tomap';
export declare function toMapProto<TSource, TKey, TElement = TSource>(this: IterableX<TSource>, options: ToMapOptions<TSource, TElement>): Map<TKey, TElement | TSource>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        toMap: typeof toMapProto;
    }
}
