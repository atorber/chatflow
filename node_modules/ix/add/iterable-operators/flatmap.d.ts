import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function flatMapProto<TSource, TResult>(this: IterableX<TSource>, fn: (value: TSource) => Iterable<TResult>, thisArg?: any): IterableX<TResult>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        flatMap: typeof flatMapProto;
    }
}
