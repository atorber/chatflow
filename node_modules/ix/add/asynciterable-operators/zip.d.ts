import { AsyncIterableX } from '../../asynciterable/asynciterablex';
/**
 * @ignore
 */
export declare function zipProto<T, T2>(this: AsyncIterableX<T>, source2: AsyncIterable<T2>): AsyncIterableX<[T, T2]>;
export declare function zipProto<T, T2, T3>(this: AsyncIterableX<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>): AsyncIterableX<[T, T2, T3]>;
export declare function zipProto<T, T2, T3, T4>(this: AsyncIterableX<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>): AsyncIterableX<[T, T2, T3, T4]>;
export declare function zipProto<T, T2, T3, T4, T5>(this: AsyncIterableX<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>, source5: AsyncIterable<T5>): AsyncIterableX<[T, T2, T3, T4, T5]>;
export declare function zipProto<T, T2, T3, T4, T5, T6>(this: AsyncIterableX<T>, source2: AsyncIterable<T2>, source3: AsyncIterable<T3>, source4: AsyncIterable<T4>, source5: AsyncIterable<T5>, source6: AsyncIterable<T6>): AsyncIterableX<[T, T2, T3, T4, T5, T6]>;
export declare function zipProto<T>(this: AsyncIterableX<T>, ...sources: AsyncIterable<T>[]): AsyncIterableX<T[]>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        zip: typeof zipProto;
    }
}
