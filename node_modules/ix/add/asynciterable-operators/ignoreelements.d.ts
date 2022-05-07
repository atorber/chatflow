import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function ignoreElementsProto<T>(this: AsyncIterableX<T>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        ignoreElements: typeof ignoreElementsProto;
    }
}
