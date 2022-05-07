import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function takeWhileProto<T, S extends T>(this: IterableX<T>, predicate: (value: T, index: number) => value is S): IterableX<S>;
export declare function takeWhileProto<T>(this: IterableX<T>, predicate: (value: T, index: number) => boolean): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        takeWhile: typeof takeWhileProto;
    }
}
