import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function reverseProto<T>(this: AsyncIterableX<T>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        reverse: typeof reverseProto;
    }
}
