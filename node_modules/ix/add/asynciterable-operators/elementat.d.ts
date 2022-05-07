import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function elementAtProto<T>(this: AsyncIterableX<T>, index: number): Promise<T | undefined>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        elementAt: typeof elementAtProto;
    }
}
