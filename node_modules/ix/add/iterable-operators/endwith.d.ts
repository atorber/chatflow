import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function endWithProto<T>(this: IterableX<T>, ...args: T[]): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        endWith: typeof endWithProto;
    }
}
