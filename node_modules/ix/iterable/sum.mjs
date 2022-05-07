import { identity } from '../util/identity';
/**
 * Computes the sum of a sequence of values.
 *
 * @param {Iterable<any>} source A sequence of values to calculate the sum.
 * @param {MathOptions<any>} [options] Optional options for providing a selector, thisArg and abort signal.
 * @returns {Promise<number>} A promise containing the sum of the sequence of values.
 */
export function sum(source, options) {
    const { ['selector']: selector = identity, ['thisArg']: thisArg } = options || {};
    let value = 0;
    for (const item of source) {
        value += selector.call(thisArg, item);
    }
    return value;
}

//# sourceMappingURL=sum.mjs.map
