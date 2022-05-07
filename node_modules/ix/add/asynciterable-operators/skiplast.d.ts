import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function skipLastProto<T>(this: AsyncIterableX<T>, count: number): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        skipLast: typeof skipLastProto;
    }
}
