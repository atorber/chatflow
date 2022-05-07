import { AsyncIterableX } from './asynciterablex';
/**
 * Generates an async-iterable sequence of integral numbers within a specified range.
 *
 * @param {number} start The value of the first integer in the sequence.
 * @param {number} count The number of sequential integers to generate.
 * @returns {AsyncIterableX<number>} An async-iterable sequence that contains a range of sequential integral numbers.
 */
export declare function range(start: number, count: number): AsyncIterableX<number>;
