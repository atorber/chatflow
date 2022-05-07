import { FindOptions } from '../../asynciterable/findoptions';
/**
 * @ignore
 */
export declare function someProto<T>(this: AsyncIterable<T>, options: FindOptions<T>): Promise<boolean>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        some: typeof someProto;
    }
}
