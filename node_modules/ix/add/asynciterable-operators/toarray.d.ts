import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function toArrayProto<TSource>(this: AsyncIterableX<TSource>): Promise<TSource[]>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        toArray: typeof toArrayProto;
    }
}
