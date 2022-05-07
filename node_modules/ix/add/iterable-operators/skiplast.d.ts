import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function skipLastProto<T>(this: IterableX<T>, count: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        skipLast: typeof skipLastProto;
    }
}
