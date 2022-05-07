import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function pluckProto<T, R>(this: IterableX<T>, ...args: string[]): IterableX<R>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        pluck: typeof pluckProto;
    }
}
