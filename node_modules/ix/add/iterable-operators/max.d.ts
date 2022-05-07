import { IterableX } from '../../iterable/iterablex';
import { ExtremaOptions } from '../../iterable/extremaoptions';
export declare function maxProto<TSource, TResult = TSource>(this: IterableX<TSource>, options?: ExtremaOptions<TSource, TResult>): TResult;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        max: typeof maxProto;
    }
}
