import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { GroupedAsyncIterable } from '../../asynciterable/operators/groupby';
export declare function groupByProto<TSource, TKey>(this: AsyncIterableX<TSource>, keySelector: (value: TSource, signal?: AbortSignal) => TKey | Promise<TKey>): AsyncIterableX<GroupedAsyncIterable<TKey, TSource>>;
export declare function groupByProto<TSource, TKey, TValue>(this: AsyncIterableX<TSource>, keySelector: (value: TSource, signal?: AbortSignal) => TKey | Promise<TKey>, elementSelector?: (value: TSource, signal?: AbortSignal) => TValue | Promise<TValue>): AsyncIterableX<GroupedAsyncIterable<TKey, TValue>>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        groupBy: typeof groupByProto;
    }
}
