import { IterableX } from '../../iterable/iterablex';
import { ExtremaOptions } from '../../iterable/extremaoptions';
/**
 * @ignore
 */
export declare function minProto<TSource, TResult = TSource>(this: IterableX<TSource>, options?: ExtremaOptions<TSource, TResult>): TResult;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        min: typeof minProto;
    }
}
