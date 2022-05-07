import { FindOptions } from '../../asynciterable/findoptions';
/**
 * @ignore
 */
export declare function everyProto<T>(this: AsyncIterable<T>, options: FindOptions<T>): Promise<boolean>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        every: typeof everyProto;
    }
}
