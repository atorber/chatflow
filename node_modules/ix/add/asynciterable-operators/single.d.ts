import { OptionalFindOptions } from '../../asynciterable/findoptions';
/**
 * @ignore
 */
export declare function singleProto<T>(this: AsyncIterable<T>, options?: OptionalFindOptions<T>): Promise<T | undefined>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        single: typeof singleProto;
    }
}
