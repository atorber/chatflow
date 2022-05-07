import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function batchProto<T>(this: AsyncIterableX<T>): AsyncIterableX<T[]>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        batch: typeof batchProto;
    }
}
