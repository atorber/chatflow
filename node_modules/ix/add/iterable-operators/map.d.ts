import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function mapProto<T, U>(this: IterableX<T>, fn: (value: T, index: number) => U, thisArg?: any): IterableX<U>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        map: typeof mapProto;
    }
}
