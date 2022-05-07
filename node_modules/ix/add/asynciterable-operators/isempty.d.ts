import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function isEmptyProto<T>(this: AsyncIterableX<T>): Promise<boolean>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        isEmpty: typeof isEmptyProto;
    }
}
