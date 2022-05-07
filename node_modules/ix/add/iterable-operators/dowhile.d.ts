import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function doWhileProto<T>(this: IterableX<T>, condition: () => boolean): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        doWhile: typeof doWhileProto;
    }
}
