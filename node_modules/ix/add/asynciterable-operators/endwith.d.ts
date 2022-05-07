import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { EndWithAsyncIterable } from '../../asynciterable/operators/endwith';
/**
 * @ignore
 */
export declare function endWithProto<T>(this: AsyncIterableX<T>, ...args: T[]): EndWithAsyncIterable<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        endWith: typeof endWithProto;
    }
}
