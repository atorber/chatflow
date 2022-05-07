import { IterableX } from '../../iterable/iterablex';
export declare function publishProto<T>(this: IterableX<T>): IterableX<T>;
export declare function publishProto<T, R>(this: IterableX<T>, selector?: (value: Iterable<T>) => Iterable<R>): IterableX<R>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        publish: typeof publishProto;
    }
}
