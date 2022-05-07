import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function flatProto<T>(this: IterableX<T>, depth?: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        flat: typeof flatProto;
    }
}
