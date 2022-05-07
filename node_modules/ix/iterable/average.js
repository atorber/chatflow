"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = void 0;
const identity_1 = require("../util/identity");
/**
 * Computes the average of the iterable sequence.
 *
 * @param {Iterable<any>} source The source iterable sequence to compute the average.
 * @param {MathOptions<any>} [options] The options for calculating the average.
 * @returns {number} The computed average for the iterable sequence.
 */
function average(source, options) {
    const { ['selector']: selector = identity_1.identity, ['thisArg']: thisArg } = options || {};
    let sum = 0;
    let count = 0;
    for (const item of source) {
        sum += selector.call(thisArg, item);
        count++;
    }
    if (count === 0) {
        throw new Error('Empty collection');
    }
    return sum / count;
}
exports.average = average;

//# sourceMappingURL=average.js.map
