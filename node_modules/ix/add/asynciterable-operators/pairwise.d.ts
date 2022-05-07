import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function pairwiseProto<T>(this: AsyncIterableX<T>): AsyncIterableX<T[]>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        pairwise: typeof pairwiseProto;
    }
}
