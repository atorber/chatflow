import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function unionProto<T>(this: IterableX<T>, right: Iterable<T>, comparer?: (x: T, y: T) => boolean): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        union: typeof unionProto;
    }
}
