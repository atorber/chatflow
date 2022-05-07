/// <reference types="node" />
import { OperatorAsyncFunction, UnaryFunction } from '../interfaces';
import { Observable } from '../observer';
/**
 * This class serves as the base for all operations which support [Symbol.asyncIterator].
 */
export declare abstract class AsyncIterableX<T> implements AsyncIterable<T> {
    abstract [Symbol.asyncIterator](signal?: AbortSignal): AsyncIterator<T>;
    forEach(projection: (value: T, index: number, signal?: AbortSignal) => void | Promise<void>, thisArg?: any, signal?: AbortSignal): Promise<void>;
    /** @nocollapse */
    pipe<R>(...operations: UnaryFunction<AsyncIterable<T>, R>[]): R;
    pipe<R>(...operations: OperatorAsyncFunction<T, R>[]): AsyncIterableX<R>;
    pipe<R extends NodeJS.WritableStream>(writable: R, options?: {
        end?: boolean;
    }): R;
}
export declare type AsyncIterableInput<TSource> = AsyncIterable<TSource> | AsyncIterator<TSource> | Iterable<TSource | PromiseLike<TSource>> | ArrayLike<TSource> | PromiseLike<TSource> | Observable<TSource>;
declare module '../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        pipe(): AsyncIterableX<T>;
        pipe<A>(op1: OperatorAsyncFunction<T, A>): AsyncIterableX<A>;
        pipe<A, B>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>): AsyncIterableX<B>;
        pipe<A, B, C>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>): AsyncIterableX<C>;
        pipe<A, B, C, D>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>, op4: OperatorAsyncFunction<C, D>): AsyncIterableX<D>;
        pipe<A, B, C, D, E>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>, op4: OperatorAsyncFunction<C, D>, op5: OperatorAsyncFunction<D, E>): AsyncIterableX<E>;
        pipe<A, B, C, D, E, F>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>, op4: OperatorAsyncFunction<C, D>, op5: OperatorAsyncFunction<D, E>, op6: OperatorAsyncFunction<E, F>): AsyncIterableX<F>;
        pipe<A, B, C, D, E, F, G>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>, op4: OperatorAsyncFunction<C, D>, op5: OperatorAsyncFunction<D, E>, op6: OperatorAsyncFunction<E, F>, op7: OperatorAsyncFunction<F, G>): AsyncIterableX<G>;
        pipe<A, B, C, D, E, F, G, H>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>, op4: OperatorAsyncFunction<C, D>, op5: OperatorAsyncFunction<D, E>, op6: OperatorAsyncFunction<E, F>, op7: OperatorAsyncFunction<F, G>, op8: OperatorAsyncFunction<G, H>): AsyncIterableX<H>;
        pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorAsyncFunction<T, A>, op2: OperatorAsyncFunction<A, B>, op3: OperatorAsyncFunction<B, C>, op4: OperatorAsyncFunction<C, D>, op5: OperatorAsyncFunction<D, E>, op6: OperatorAsyncFunction<E, F>, op7: OperatorAsyncFunction<F, G>, op8: OperatorAsyncFunction<G, H>, op9: OperatorAsyncFunction<H, I>): AsyncIterableX<I>;
        pipe(...operations: OperatorAsyncFunction<any, any>[]): AsyncIterableX<any>;
        pipe<A extends NodeJS.WritableStream>(op1: A, options?: {
            end?: boolean;
        }): A;
    }
}
