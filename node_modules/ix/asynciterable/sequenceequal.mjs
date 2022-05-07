import { comparerAsync } from '../util/comparer';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
/**
 * Determines whether two sequences are equal by comparing the elements pairwise.
 *
 * @template T The type of the elements in the source sequence.
 * @param {AsyncIterable<T>} source First async-iterable sequence to compare.
 * @param {AsyncIterable<T>} other Second async-iterable sequence to compare.
 * @param {SequencEqualOptions<T>} [options] The sequence equal options which include an optional comparer and optional abort signal.
 * @returns {Promise<boolean>} A promise which indicates whether both sequences are of equal length and their
 * corresponding elements are equal.
 */
export async function sequenceEqual(source, other, options) {
    const { ['comparer']: comparer = comparerAsync, ['signal']: signal } = options || {};
    throwIfAborted(signal);
    const it1 = wrapWithAbort(source, signal)[Symbol.asyncIterator]();
    const it2 = wrapWithAbort(other, signal)[Symbol.asyncIterator]();
    let next1;
    let next2;
    while (!(next1 = await it1.next()).done) {
        if (!(!(next2 = await it2.next()).done && (await comparer(next1.value, next2.value)))) {
            return false;
        }
    }
    return !!(await it2.next()).done;
}

//# sourceMappingURL=sequenceequal.mjs.map
