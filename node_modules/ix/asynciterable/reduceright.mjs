import { toArray } from './toarray';
import { throwIfAborted } from '../aborterror';
/**
 * Applies an accumulator function over an async-iterable sequence from the end, returning the result of the aggregation as a
 * single element in the result sequence. The seed value, if specified, is used as the initial accumulator value.
 * For aggregation behavior with incremental intermediate results, scan.
 *
 * @template T The type of the elements in the source sequence.
 * @template R The type of the result of the aggregation.
 * @param {AsyncIterable<T>} source An async-iterable sequence to aggregate over from the right.
 * @param {ReduceOptions<T, R>} options The options which contains a callback, with optional seed and an optional abort signal for cancellation.
 * @returns {Promise<R>} A promise with the final accumulator value.
 */
export async function reduceRight(source, options) {
    const { ['seed']: seed, ['signal']: signal, ['callback']: callback } = options;
    const hasSeed = options.hasOwnProperty('seed');
    throwIfAborted(signal);
    const array = await toArray(source, signal);
    let hasValue = false;
    let acc = seed;
    for (let offset = array.length - 1; offset >= 0; offset--) {
        const item = array[offset];
        if (hasValue || (hasValue = hasSeed)) {
            acc = await callback(acc, item, offset, signal);
        }
        else {
            acc = item;
            hasValue = true;
        }
    }
    if (!(hasSeed || hasValue)) {
        throw new Error('Sequence contains no elements');
    }
    return acc;
}

//# sourceMappingURL=reduceright.mjs.map
