import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function defaultIfEmptyProto<T>(this: IterableX<T>, defaultValue: T): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        defaultIfEmpty: typeof defaultIfEmptyProto;
    }
}
