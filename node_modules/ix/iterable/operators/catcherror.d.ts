import { IterableX } from '../iterablex';
import { OperatorFunction } from '../../interfaces';
export declare class CatchWithIterable<TSource, TResult> extends IterableX<TSource | TResult> {
    private _source;
    private _handler;
    constructor(source: Iterable<TSource>, handler: (error: any) => Iterable<TResult>);
    [Symbol.iterator](): Generator<TSource | TResult, void, unknown>;
}
/**
 * Continues an async-iterable sequence that is terminated by an exception with the
 * async-iterable sequence produced by the handler.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of elements from the handler function.
 * @param {(error: any) => Iterable<TResult>} handler Error handler function, producing another async-iterable sequence.
 * @returns {(OperatorFunction<TSource, TSource | TResult>)} An operator which continues an async-iterable sequence that is terminated by
 * an exception with the specified handler.
 */
export declare function catchError<TSource, TResult>(handler: (error: any) => Iterable<TResult>): OperatorFunction<TSource, TSource | TResult>;
