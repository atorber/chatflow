import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function expandProto<T>(this: IterableX<T>, fn: (value: T) => Iterable<T>): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        expand: typeof expandProto;
    }
}
