import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { StartWithAsyncIterable } from '../../asynciterable/operators/startwith';
/**
 * @ignore
 */
export declare function startWithProto<T>(this: AsyncIterableX<T>, ...args: T[]): StartWithAsyncIterable<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        startWith: typeof startWithProto;
    }
}
