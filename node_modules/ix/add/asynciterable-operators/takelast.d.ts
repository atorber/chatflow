import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function takeLastProto<T>(this: AsyncIterableX<T>, count: number): AsyncIterableX<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        takeLast: typeof takeLastProto;
    }
}
