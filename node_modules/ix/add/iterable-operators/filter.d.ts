import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function filterProto<T, S extends T>(this: IterableX<T>, predicate: (value: T, index: number) => value is S, thisArg?: any): IterableX<S>;
export declare function filterProto<T>(this: IterableX<T>, predicate: (value: T, index: number) => boolean, thisArg?: any): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        filter: typeof filterProto;
    }
}
