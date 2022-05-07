import { AsyncIterableX } from '../asynciterablex';
import { OperatorAsyncFunction } from '../../interfaces';
export declare class BatchAsyncIterable<TSource> extends AsyncIterableX<TSource[]> {
    private _source;
    constructor(source: AsyncIterable<TSource>);
    [Symbol.asyncIterator](signal?: AbortSignal): {
        next(): Promise<IteratorResult<TSource[], any>>;
        return(value: any): Promise<IteratorReturnResult<any> | IteratorYieldResult<TSource[]>>;
    };
}
/**
Returns an async iterable sequence of batches that are collected from the source sequence between
 * subsequent `next()` calls.
 *
 * @template TSource The type of elements in the source sequence.
 * @returns {OperatorAsyncFunction<TSource, TSource[]>} An operator returning an async-iterable of batches that are collection from the
 * source sequence between subsequent `next()` calls.
 */
export declare function batch<TSource>(): OperatorAsyncFunction<TSource, TSource[]>;
