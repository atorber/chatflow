import { IterableX } from '../iterablex';
export class PairwiseIterable extends IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        let value;
        let hasValue = false;
        for (const item of this._source) {
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
 * @returns {OperatorFunction<TSource, TSource[]>} The result sequence.
 */
export function pairwise() {
    return function pairwiseOperatorFunction(source) {
        return new PairwiseIterable(source);
    };
}

//# sourceMappingURL=pairwise.mjs.map
