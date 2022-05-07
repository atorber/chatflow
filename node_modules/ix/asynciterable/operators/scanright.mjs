import { AsyncIterableX } from '../asynciterablex';
import { toArray } from '../toarray';
import { throwIfAborted } from '../../aborterror';
export class ScanRightAsyncIterable extends AsyncIterableX {
    _source;
    _fn;
    _seed;
    _hasSeed;
    constructor(source, options) {
        super();
        this._source = source;
        this._fn = options['callback'];
        this._hasSeed = options.hasOwnProperty('seed');
        this._seed = options['seed'];
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let hasValue = false;
        let acc = this._seed;
        const source = await toArray(this._source, signal);
        for (let offset = source.length - 1; offset >= 0; offset--) {
            const item = source[offset];
            if (hasValue || (hasValue = this._hasSeed)) {
                acc = await this._fn(acc, item, offset, signal);
                yield acc;
            }
            else {
                acc = item;
                hasValue = true;
            }
        }
    }
}
/**
 * Applies an accumulator function over an async-iterable sequence from the right and returns each intermediate result.
 * The specified seed value, if given, is used as the initial accumulator value.
 *
 * @template T The type of the elements in the source sequence.
 * @template R The type of the result of the aggregation.
 * @param {ScanOptions<T, R>} options The options including the accumulator function and seed.
 * @returns {OperatorAsyncFunction<T, R>} An async-enumerable sequence containing the accumulated values from the right.
 */
export function scanRight(options) {
    return function scanRightOperatorFunction(source) {
        return new ScanRightAsyncIterable(source, options);
    };
}

//# sourceMappingURL=scanright.mjs.map
