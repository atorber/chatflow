import { IterableX } from '../../iterable/iterablex';
/**
 * @ignore
 */
export declare function zipProto<T, T2>(this: IterableX<T>, source2: Iterable<T2>): IterableX<[T, T2]>;
export declare function zipProto<T, T2, T3>(this: IterableX<T>, source2: Iterable<T2>, source3: Iterable<T3>): IterableX<[T, T2, T3]>;
export declare function zipProto<T, T2, T3, T4>(this: IterableX<T>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>): IterableX<[T, T2, T3, T4]>;
export declare function zipProto<T, T2, T3, T4, T5>(this: IterableX<T>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>, source5: Iterable<T5>): IterableX<[T, T2, T3, T4, T5]>;
export declare function zipProto<T, T2, T3, T4, T5, T6>(this: IterableX<T>, source2: Iterable<T2>, source3: Iterable<T3>, source4: Iterable<T4>, source5: Iterable<T5>, source6: Iterable<T6>): IterableX<[T, T2, T3, T4, T5, T6]>;
export declare function zipProto<T>(this: IterableX<T>, ...sources: Iterable<T>[]): IterableX<T[]>;
declare module '../../iterable/iterablex' {
    interface IterableX<T> {
        zip: typeof zipProto;
    }
}
