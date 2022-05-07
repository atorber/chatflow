import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function takeWhileProto<T, S extends T>(this: AsyncIterableX<T>, predicate: (value: T, index: number, signal?: AbortSignal) => value is S): AsyncIterableX<S>;
export declare function takeWhileProto<T>(this: AsyncIterableX<T>, predicate: (value: T, index: number, signal?: AbortSignal) => boolean | Promise<boolean>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        takeWhile: typeof takeWhileProto;
    }
}
