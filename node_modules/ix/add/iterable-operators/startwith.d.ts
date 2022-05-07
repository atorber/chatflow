import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function startWithProto<T>(this: IterableX<T>, ...args: T[]): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        startWith: typeof startWithProto;
    }
}
