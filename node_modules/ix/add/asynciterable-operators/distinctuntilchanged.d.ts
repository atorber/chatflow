import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { DistinctOptions } from '../../asynciterable/operators/distinctoptions';
/**
 * @ignore
 */
export declare function distinctUntilChangedProto<TSource, TKey>(this: AsyncIterableX<TSource>, options?: DistinctOptions<TSource, TKey>): AsyncIterableX<TSource>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        distinctUntilChanged: typeof distinctUntilChangedProto;
    }
}
