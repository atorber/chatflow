import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function isEmptyProto<T>(this: IterableX<T>): boolean;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        isEmpty: typeof isEmptyProto;
    }
}
