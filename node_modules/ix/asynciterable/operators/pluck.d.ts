import { OperatorAsyncFunction } from '../../interfaces';
/**
 * Maps each source value to its specified nested property.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the result sequence, obtained by the property names.
 * @param {...string[]} args The nested properties to pluck from each source value.
 * @returns {OperatorAsyncFunction<TSource, TResult>} An async-iterable of property values from the source values.
 */
export declare function pluck<TSource, TResult>(...args: string[]): OperatorAsyncFunction<TSource, TResult>;
