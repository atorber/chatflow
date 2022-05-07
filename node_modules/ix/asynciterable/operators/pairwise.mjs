import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class PairwiseAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let value;
        let hasValue = false;
        for await (const item of wrapWithAbort(this._source, signal)) {
            if (!hasValue) {
                hasValue = true;
            }
            else {
                yield [value, item];
            }
            value = item;
        }
    }
}
/**
 * Returns a sequence of each element in the input sequence and its predecessor, with the exception of the
 * first element which is only returned as the predecessor of the second element.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {OperatorAsyncFunction<TSource, TSource[]>} The result sequence.
 */
export function pairwise() {
    return function pairwiseOperatorFunction(source) {
        return new PairwiseAsyncIterable(source);
    };
}

//# sourceMappingURL=pairwise.mjs.map
