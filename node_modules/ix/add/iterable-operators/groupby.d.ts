import { IterableX } from '../../iterable/iterablex';
import { GroupedIterable } from '../../iterable/operators/groupby';
export declare function groupByProto<TSource, TKey>(this: IterableX<TSource>, keySelector: (value: TSource) => TKey): IterableX<GroupedIterable<TKey, TSource>>;
export declare function groupByProto<TSource, TKey, TValue>(this: IterableX<TSource>, keySelector: (value: TSource) => TKey, elementSelector?: (value: TSource) => TValue): IterableX<GroupedIterable<TKey, TValue>>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        groupBy: typeof groupByProto;
    }
}
