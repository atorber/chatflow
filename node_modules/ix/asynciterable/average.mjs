import { identityAsync } from '../util/identity';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
/**
 * Computes the average of the async-iterable sequence.
 *
 * @param {AsyncIterable<any>} source source async-iterable sequence to compute the average.
 * @param {AverageOptions<any>} [options] The options for calculating the average.
 * @returns {Promise<number>} A Promise which returns the computed average for the async-iterable sequence.
 */
export async function average(source, options) {
    const { ['selector']: selector = identityAsync, ['signal']: signal, ['thisArg']: thisArg, } = options || {};
    throwIfAborted(signal);
    let sum = 0;
    let count = 0;
    for await (const item of wrapWithAbort(source, signal)) {
        sum += await selector.call(thisArg, item, signal);
        count++;
    }
    if (count === 0) {
        throw new Error('Empty collection');
    }
    return sum / count;
}

//# sourceMappingURL=average.mjs.map
