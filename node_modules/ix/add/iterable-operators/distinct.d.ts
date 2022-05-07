import { IterableX } from '../../iterable/iterablex';
import { DistinctOptions } from '../..//iterable/operators/distinctoptions';
/**
 * @ignore
 */
export declare function distinctProto<TSource, TKey>(this: IterableX<TSource>, options?: DistinctOptions<TSource, TKey>): IterableX<TSource>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        distinct: typeof distinctProto;
    }
}
