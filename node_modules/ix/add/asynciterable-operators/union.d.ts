import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function unionProto<T>(this: AsyncIterableX<T>, right: AsyncIterable<T>, comparer?: (x: T, y: T) => boolean | Promise<boolean>): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        union: typeof unionProto;
    }
}
