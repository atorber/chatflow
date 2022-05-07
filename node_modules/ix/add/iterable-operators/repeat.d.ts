import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function repeatProto<T>(this: IterableX<T>, count?: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        repeat: typeof repeatProto;
    }
}
