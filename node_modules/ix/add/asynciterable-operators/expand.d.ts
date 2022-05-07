import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { ExpandAsyncIterable } from '../../asynciterable/operators/expand';
/**
 * @ignore
 */
export declare function expandProto<T>(this: AsyncIterableX<T>, selector: (value: T, signal?: AbortSignal) => AsyncIterable<T> | Promise<AsyncIterable<T>>): ExpandAsyncIterable<T>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        expand: typeof expandProto;
    }
}
