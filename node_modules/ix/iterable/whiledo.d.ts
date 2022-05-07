import { IterableX } from './iterablex';
/**
 * Repeats the given source as long as the specified conditions holds, where
 * the condition is evaluated before each repeated source is iterated.
 *
 * @template TSource
 * @param {Iterable<TSource>} source Source to repeat as long as the condition function evaluates to true.
 * @param {((signal?: AbortSignal) => boolean)} condition Condition that will be evaluated before the source sequence is iterated.
 * @returns {IterableX<TSource>} An iterable which is repeated while the condition returns true.
 */
export declare function whileDo<TSource>(source: Iterable<TSource>, condition: () => boolean): IterableX<TSource>;
