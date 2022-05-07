import { ExtremaOptions } from '../../iterable/extremaoptions';
/**
 * @ignore
 */
export declare function minByProto<TSource, TKey>(this: Iterable<TSource>, options?: ExtremaOptions<TSource, TKey>): TSource[];
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        minBy: typeof minByProto;
    }
}
