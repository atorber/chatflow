import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function ignoreElementsProto<T>(this: IterableX<T>): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        ignoreElements: typeof ignoreElementsProto;
    }
}
