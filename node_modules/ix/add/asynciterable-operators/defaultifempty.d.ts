import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function defaultIfEmptyProto<T>(this: AsyncIterableX<T>, defaultValue: T): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        defaultIfEmpty: typeof defaultIfEmptyProto;
    }
}
