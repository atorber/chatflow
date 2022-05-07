import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function toSetProto<TSource>(this: IterableX<TSource>): Set<TSource>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        toSet: typeof toSetProto;
    }
}
