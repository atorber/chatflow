import { FindOptions } from '../../asynciterable/findoptions';
/**
 * @ignore
 */
export declare function findProto<T>(this: AsyncIterable<T>, options: FindOptions<T>): Promise<T | undefined>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        find: typeof findProto;
    }
}
