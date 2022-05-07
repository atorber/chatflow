import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function includesProto<T>(this: IterableX<T>, searchElement: T, fromIndex: number): boolean;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        includes: typeof includesProto;
    }
}
