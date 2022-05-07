import { IterableX } from '../../iterable/iterablex';
import { ExtremaOptions } from '../../iterable/extremaoptions';
/**
 * @ignore
 */
export declare function maxByProto<TSource, TKey>(this: IterableX<TSource>, options?: ExtremaOptions<TSource, TKey>): TSource[];
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        maxBy: typeof maxByProto;
    }
}
