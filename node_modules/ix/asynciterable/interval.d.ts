import { AsyncIterableX } from './asynciterablex';
/**
 * Produces a new item in an async-iterable at the given interval cycle time.
 *
 * @param {number} dueTime The due time in milliseconds to spawn a new item.
 * @returns {AsyncIterableX<number>} An async-iterable producing values at the specified interval.
 */
export declare function interval(dueTime: number): AsyncIterableX<number>;
