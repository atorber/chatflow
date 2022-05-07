import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function repeatProto<T>(this: AsyncIterableX<T>, count?: number): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        repeat: typeof repeatProto;
    }
}
