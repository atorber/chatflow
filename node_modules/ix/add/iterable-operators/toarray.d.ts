import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function toArrayProto<TSource>(this: IterableX<TSource>): TSource[];
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        toArray: typeof toArrayProto;
    }
}
