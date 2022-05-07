import { repeatValue } from '../../iterable/repeatvalue';
import { CatchAllAsyncIterable } from '../catcherror';
/**
 * Retries the async-iterable instance the number of given times. If not supplied, it will try infinitely.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {number} [count=-1] An optional number of times to retry, otherwise is set to infinite retries
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable sequence producing the elements of the
 * given sequence repeatedly until it terminates successfully.
 */
export function retry(count = -1) {
    return function retryOperatorFunction(source) {
        return new CatchAllAsyncIterable(repeatValue(source, count));
    };
}

//# sourceMappingURL=retry.mjs.map
