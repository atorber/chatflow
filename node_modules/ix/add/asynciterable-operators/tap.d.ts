import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { PartialAsyncObserver } from '../../observer';
/** @ignore */
export declare function tapProto<T>(observer: PartialAsyncObserver<T>): AsyncIterableX<T>;
/** @ignore */
export declare function tapProto<T>(next?: ((value: T) => any) | null, error?: ((err: any) => any) | null, complete?: (() => any) | null): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        tap: typeof tapProto;
    }
}
