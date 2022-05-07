import { IterableX } from '../../iterable/iterablex';
export declare function memoizeProto<TSource>(this: IterableX<TSource>, readerCount?: number): IterableX<TSource>;
export declare function memoizeProto<TSource, TResult>(this: IterableX<TSource>, readerCount?: number, selector?: (value: Iterable<TSource>) => Iterable<TResult>): IterableX<TResult>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        memoize: typeof memoizeProto;
    }
}
