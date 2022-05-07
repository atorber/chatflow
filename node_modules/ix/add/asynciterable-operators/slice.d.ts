import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function sliceProto<T>(this: AsyncIterableX<T>, begin: number, end: number): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        slice: typeof sliceProto;
    }
}
