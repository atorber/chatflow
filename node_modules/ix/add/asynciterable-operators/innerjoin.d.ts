import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function innerJoinProto<TOuter, TInner, TKey, TResult>(this: AsyncIterableX<TOuter>, inner: AsyncIterable<TInner>, outerSelector: (value: TOuter) => TKey | Promise<TKey>, innerSelector: (value: TInner) => TKey | Promise<TKey>, resultSelector: (outer: TOuter, inner: TInner) => TResult | Promise<TResult>): AsyncIterableX<TResult>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        innerJoin: typeof innerJoinProto;
    }
}
