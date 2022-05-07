import { IterableX } from '../../iterable/iterablex';
import { OrderedIterableX } from '../../iterable/operators/orderby';
import { thenBy as _thenBy, thenByDescending as _thenByDescending } from '../../iterable/operators/orderby';
/**
 * @ignore
 */
export declare function orderByProto<TKey, TSource>(this: IterableX<TSource>, keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): OrderedIterableX<TKey, TSource>;
/**
 * @ignore
 */
export declare function orderByDescendingProto<TKey, TSource>(this: IterableX<TSource>, keySelector: (item: TSource) => TKey, comparer?: (fst: TKey, snd: TKey) => number): OrderedIterableX<TKey, TSource>;
export declare namespace iterable {
    let thenBy: typeof _thenBy;
    let thenByDescending: typeof _thenByDescending;
}
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        orderBy: typeof orderByProto;
        orderByDescending: typeof orderByDescendingProto;
    }
}
