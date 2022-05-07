import { of } from './of';
import { RepeatIterable } from './operators/repeat';
/**
 * Repeats a given value for the specified number of times as an iterable.
 *
 * @template TSource The type of element to repeat.
 * @param {TSource} value The value to repeat as an iterable.
 * @param {number} [count=-1] The number of times to repeat the value, infinite if not specified.
 * @returns {AsyncIterableX<TSource>} An iterable with a single item that is repeated over the specified times.
 */
export function repeatValue(value, count = -1) {
    return new RepeatIterable(of(value), count);
}

//# sourceMappingURL=repeatvalue.mjs.map
