import { AsyncIterableX } from './asynciterablex';
/**
 * Returns an empty async-iterable sequence.
 *
 * @template TSource The type used for the async-iterable type parameter of the resulting sequence.
 * @returns {AsyncIterableX<never>} An async-iterable sequence with no elements.
 */
export declare function empty(): AsyncIterableX<never>;
