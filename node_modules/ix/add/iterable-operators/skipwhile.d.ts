import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function skipWhileProto<T, S extends T>(this: IterableX<T>, predicate: (value: T, index: number) => value is S): IterableX<S>;
export declare function skipWhileProto<T>(this: IterableX<T>, predicate: (value: T, index: number) => boolean): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        skipWhile: typeof skipWhileProto;
    }
}
