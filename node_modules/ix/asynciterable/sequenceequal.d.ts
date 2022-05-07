/**
 * The options for sequence equal operations including a comparer and abort signal
 *
 * @interface SequencEqualOptions
 * @template T The type of items to compare.
 */
export interface SequencEqualOptions<T> {
    /**
     * The comparer function which returns true if the items are equal, false otherwise.
     *
     * @memberof SequencEqualOptions
     */
    comparer?: (first: T, second: T) => boolean | Promise<boolean>;
    /**
     * An optional abort signal to cancel the operation at any time.
     *
     * @type {AbortSignal}
     * @memberof SequencEqualOptions
     */
    signal?: AbortSignal;
}
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
export declare function sequenceEqual<T>(source: AsyncIterable<T>, other: AsyncIterable<T>, options?: SequencEqualOptions<T>): Promise<boolean>;
