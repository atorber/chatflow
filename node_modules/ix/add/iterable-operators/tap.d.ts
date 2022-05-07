import { IterableX } from '../../iterable/iterablex';
import { PartialObserver } from '../../observer';
/**
 * @ignore
 */
export declare function tapProto<TSource>(this: IterableX<TSource>, observer: PartialObserver<TSource>): IterableX<TSource>;
export declare function tapProto<TSource>(this: IterableX<TSource>, next?: ((value: TSource) => any) | null, error?: ((err: any) => any) | null, complete?: (() => any) | null): IterableX<TSource>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        tap: typeof tapProto;
    }
}
