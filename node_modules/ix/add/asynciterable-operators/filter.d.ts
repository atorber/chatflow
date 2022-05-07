import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function filterProto<T, S extends T>(this: AsyncIterableX<T>, predicate: (value: T, index: number, signal?: AbortSignal) => value is S, thisArg?: any): AsyncIterableX<S>;
export declare function filterProto<T>(this: AsyncIterableX<T>, predicate: (value: T, index: number, signal?: AbortSignal) => boolean | Promise<boolean>, thisArg?: any): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        filter: typeof filterProto;
    }
}
