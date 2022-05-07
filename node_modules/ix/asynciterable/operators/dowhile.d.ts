import { MonoTypeOperatorAsyncFunction } from '../../interfaces';
/**
 * Generates an async-iterable sequence by repeating a source sequence as long as the given loop postcondition holds.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {((signal?: AbortSignal) => boolean | Promise<boolean>)} condition Loop condition.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that generates an async-iterable by repeating a
 * source sequence while the postcondition holds.
 */
export declare function doWhile<TSource>(condition: (signal?: AbortSignal) => boolean | Promise<boolean>): MonoTypeOperatorAsyncFunction<TSource>;
