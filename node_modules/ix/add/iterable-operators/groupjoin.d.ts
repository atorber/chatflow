import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function groupJoinProto<TOuter, TInner, TKey, TResult>(this: IterableX<TOuter>, inner: Iterable<TInner>, outerSelector: (value: TOuter) => TKey, innerSelector: (value: TInner) => TKey, resultSelector: (outer: TOuter, inner: Iterable<TInner>) => TResult): IterableX<TResult>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        groupJoin: typeof groupJoinProto;
    }
}
