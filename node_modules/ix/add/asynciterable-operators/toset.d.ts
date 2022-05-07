import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function toSetProto<TSource>(this: AsyncIterableX<TSource>): Promise<Set<TSource>>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toSet: typeof toSetProto;
    }
}
