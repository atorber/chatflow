import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function retryProto<T>(this: IterableX<T>, count?: number): IterableX<T>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        retry: typeof retryProto;
    }
}
