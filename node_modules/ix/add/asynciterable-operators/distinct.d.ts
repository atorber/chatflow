import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { DistinctOptions } from '../../asynciterable/operators/distinctoptions';
/**
 * @ignore
 */
export declare function distinctProto<TSource, TKey>(this: AsyncIterableX<TSource>, options?: DistinctOptions<TSource, TKey>): AsyncIterableX<TSource>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        distinct: typeof distinctProto;
    }
}
