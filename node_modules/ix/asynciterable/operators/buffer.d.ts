import { AsyncIterableX } from '../asynciterablex';
import { OperatorAsyncFunction } from '../../interfaces';
export declare class BufferAsyncIterable<TSource> extends AsyncIterableX<TSource[]> {
    private _source;
    private _count;
    private _skip;
    constructor(source: AsyncIterable<TSource>, count: number, skip: number);
    [Symbol.asyncIterator](signal?: AbortSignal): AsyncGenerator<TSource[], void, unknown>;
}
/**
 * Projects each element of an async-iterable sequence into consecutive non-overlapping
 * buffers which are produced based on element count information.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} count The length of each buffer.
 * @param {number} [skip] An optional number of elements to skip between creation of consecutive buffers.
 * @returns {OperatorAsyncFunction<TSource, TSource[]>} An operator which returns anm async-iterable sequence with
 * consecutive non-overlapping buffers based upon element count information.
 */
export declare function buffer<TSource>(count: number, skip?: number): OperatorAsyncFunction<TSource, TSource[]>;
/**
 * Projects each element of an async-iterable sequence into consecutive non-overlapping
 * buffers which are produced based on element count information.
 * @param count Length of each buffer.
 * @param skip Number of elements to skip between creation of consecutive buffers.
 */
