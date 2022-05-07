import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function mapProto<T, R>(this: AsyncIterableX<T>, selector: (value: T, index: number, signal?: AbortSignal) => Promise<R> | R, thisArg?: any): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        map: typeof mapProto;
    }
}
