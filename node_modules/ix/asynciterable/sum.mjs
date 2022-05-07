import { identityAsync } from '../util/identity';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
/**
 * Computes the sum of a sequence of values.
 *
 * @param {AsyncIterable<any>} source A sequence of values to calculate the sum.
 * @param {MathOptions<any>} [options] Optional options for providing a selector, thisArg and abort signal.
 * @returns {Promise<number>} A promise containing the sum of the sequence of values.
 */
export async function sum(source, options) {
    const { ['selector']: selector = identityAsync, ['signal']: signal, ['thisArg']: thisArg, } = options || {};
    throwIfAborted(signal);
    let value = 0;
    for await (const item of wrapWithAbort(source, signal)) {
        value += await selector.call(thisArg, item, signal);
    }
    return value;
}

//# sourceMappingURL=sum.mjs.map
