import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function sliceProto<T>(this: IterableX<T>, begin: number, end: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        slice: typeof sliceProto;
    }
}
