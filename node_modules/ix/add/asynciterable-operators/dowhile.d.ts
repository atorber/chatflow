import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function doWhileProto<T>(this: AsyncIterableX<T>, condition: () => boolean | Promise<boolean>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        doWhile: typeof doWhileProto;
    }
}
