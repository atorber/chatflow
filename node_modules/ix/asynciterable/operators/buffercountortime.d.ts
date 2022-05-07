import { OperatorAsyncFunction } from '../../interfaces';
/**
 * Projects each element of an async-iterable sequence into consecutive buffers
 * which are emitted when either the threshold count or time is met.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {number} count The size of the buffer.
 * @param {number} time The threshold number of milliseconds to wait before flushing a non-full buffer
 * @returns {OperatorAsyncFunction<TSource, TSource[]>} An operator which returns an async-iterable sequence
 * of buffers
 */
export declare function bufferCountOrTime<TSource>(count: number, time: number): OperatorAsyncFunction<TSource, TSource[]>;
