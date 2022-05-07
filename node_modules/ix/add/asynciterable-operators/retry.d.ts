import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function retryProto<T>(this: AsyncIterableX<T>, count?: number): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        retry: typeof retryProto;
    }
}
