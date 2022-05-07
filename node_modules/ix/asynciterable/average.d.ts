import { MathOptions } from './mathoptions';
/**
 * Computes the average of the async-iterable sequence.
 *
 * @param {AsyncIterable<number>} source The source async-iterable sequence to compute the average.
 * @param {AverageOptions<number>} [options] The options for calculating the average.
 * @returns {Promise<number>} A Promise which returns the computed average for the async-iterable sequence.
 */
export declare function average(source: AsyncIterable<number>, options?: MathOptions<number>): Promise<number>;
/**
 * Computes the average of the async-iterable sequence.
 *
 * @template TSource The type of elements in the source sequence.
 * @param {AsyncIterable<TSource>} source source async-iterable sequence to compute the average.
 * @param {AverageOptions<TSource>} [options] The options for calculating the average.
 * @returns {Promise<number>} A Promise which returns the computed average for the async-iterable sequence.
 */
export declare function average<TSource>(source: AsyncIterable<TSource>, options?: MathOptions<TSource>): Promise<number>;
