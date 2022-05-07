import { OptionalFindOptions } from '../../asynciterable/findoptions';
/**
 * @ignore
 */
export declare function countProto<T>(this: AsyncIterable<T>, options?: OptionalFindOptions<T>): Promise<number>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        count: typeof countProto;
    }
}
