import { MathOptions } from './mathoptions';
/**
 * Computes the average of the iterable sequence.
 *
 * @param {Iterable<number>} source The source iterable sequence to compute the average.
 * @param {MathOptions<number>} [options] The options for calculating the average.
 * @returns {number} The computed average for the iterable sequence.
 */
export declare function average(source: Iterable<number>, options?: MathOptions<number>): number;
/**
 * Computes the average of the iterable sequence.
 *
 * @template T The type of elements in the source sequence.
 * @param {Iterable<T>} source The source iterable sequence to compute the average.
 * @param {MathOptions<T>} [options] The options for calculating the average.
 * @returns {number} The computed average for the iterable sequence.
 */
export declare function average<T>(source: Iterable<T>, options?: MathOptions<T>): number;
