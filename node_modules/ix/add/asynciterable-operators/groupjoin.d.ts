import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function groupJoinProto<TOuter, TInner, TKey, TResult>(this: AsyncIterableX<TOuter>, inner: AsyncIterable<TInner>, outerSelector: (value: TOuter) => TKey | Promise<TKey>, innerSelector: (value: TInner) => TKey | Promise<TKey>, resultSelector: (outer: TOuter, inner: AsyncIterable<TInner>) => TResult | Promise<TResult>): AsyncIterableX<TResult>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        groupJoin: typeof groupJoinProto;
    }
}
