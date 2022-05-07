import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function pairwiseProto<T>(this: IterableX<T>): IterableX<T[]>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        pairwise: typeof pairwiseProto;
    }
}
