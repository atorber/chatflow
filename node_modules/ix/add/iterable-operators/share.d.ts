import { IterableX } from '../../iterable/iterablex';
export declare function shareProto<TSource>(this: IterableX<TSource>): IterableX<TSource>;
export declare function shareProto<TSource, TResult>(this: IterableX<TSource>, fn?: (value: Iterable<TSource>) => Iterable<TResult>): IterableX<TResult>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        share: typeof shareProto;
    }
}
