import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function mergeAllProto<T>(this: AsyncIterableX<AsyncIterable<T>>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        mergeAll: typeof mergeAllProto;
    }
}
