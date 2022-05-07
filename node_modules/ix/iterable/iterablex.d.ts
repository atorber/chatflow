/// <reference types="node" />
import { UnaryFunction, OperatorFunction } from '../interfaces';
/**
 * This class serves as the base for all operations which support [Symbol.iterator].
 */
export declare abstract class IterableX<T> implements Iterable<T> {
    abstract [Symbol.iterator](): Iterator<T>;
    forEach(projection: (value: T, index: number) => void, thisArg?: any): void;
    /** @nocollapse */
    pipe<R>(...operations: UnaryFunction<Iterable<T>, R>[]): R;
    pipe<R>(...operations: OperatorFunction<T, R>[]): IterableX<R>;
    pipe<R extends NodeJS.WritableStream>(writable: R, options?: {
        end?: boolean;
    }): R;
}
declare module '../iterable/iterablex' {
    interface IterableX<T> extends Iterable<T> {
        pipe(): IterableX<T>;
        pipe<A>(op1: OperatorFunction<T, A>): IterableX<A>;
        pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): IterableX<B>;
        pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): IterableX<C>;
        pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): IterableX<D>;
        pipe<A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): IterableX<E>;
        pipe<A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): IterableX<F>;
        pipe<A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): IterableX<G>;
        pipe<A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): IterableX<H>;
        pipe<A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): IterableX<I>;
        pipe<R>(...operations: OperatorFunction<T, R>[]): IterableX<R>;
        pipe<A extends NodeJS.WritableStream>(op1: A, options?: {
            end?: boolean;
        }): A;
    }
}
