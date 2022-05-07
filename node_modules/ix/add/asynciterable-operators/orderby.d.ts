import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { OrderedAsyncIterableX } from '../../asynciterable/operators/orderby';
import { thenBy as _thenBy, thenByDescending as _thenByDescending } from '../../asynciterable/operators/orderby';
/**
 * @ignore
 */
export declare function orderByProto<TKey, TSource>(this: AsyncIterableX<TSource>, keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): OrderedAsyncIterableX<TKey, TSource>;
/**
 * @ignore
 */
export declare function orderByDescendingProto<TKey, TSource>(this: AsyncIterableX<TSource>, keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): OrderedAsyncIterableX<TKey, TSource>;
export declare namespace asynciterable {
    let thenBy: typeof _thenBy;
    let thenByDescending: typeof _thenByDescending;
}
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        orderBy: typeof orderByProto;
        orderByDescending: typeof orderByDescendingProto;
    }
}
