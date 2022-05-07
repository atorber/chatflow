import { AsyncIterableX } from './asynciterablex';
/**
 * Repeats the given source as long as the specified conditions holds, where
 * the condition is evaluated before each repeated source is iterated.
 *
 * @template TSource
 * @param {AsyncIterable<TSource>} source Source to repeat as long as the condition function evaluates to true.
 * @param {((signal?: AbortSignal) => boolean | Promise<boolean>)} condition Condition that will be evaluated before the source sequence is iterated.
 * @returns {AsyncIterableX<TSource>} An async-iterable which is repeated while the condition returns true.
 */
export declare function whileDo<TSource>(source: AsyncIterable<TSource>, condition: (signal?: AbortSignal) => boolean | Promise<boolean>): AsyncIterableX<TSource>;
