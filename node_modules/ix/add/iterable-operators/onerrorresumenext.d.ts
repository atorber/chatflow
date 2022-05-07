import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function onErrorResumeNextProto<TSource>(this: IterableX<TSource>, ...args: Iterable<TSource>[]): IterableX<TSource>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        onErrorResumeNext: typeof onErrorResumeNextProto;
    }
}
