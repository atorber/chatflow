import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function intersectProto<T>(this: IterableX<T>, second: IterableX<T>, comparer?: (x: T, y: T) => boolean): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        intersect: typeof intersectProto;
    }
}
