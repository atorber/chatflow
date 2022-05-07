import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function concatAllProto<T>(this: AsyncIterableX<AsyncIterable<T>>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        concatAll: typeof concatAllProto;
    }
}
