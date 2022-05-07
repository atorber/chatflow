import { IterableX } from './iterablex';
import { returnIterator } from '../util/returniterator';
export class CatchIterable extends IterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    *[Symbol.iterator]() {
        let error = null;
        let hasError = false;
        for (const source of this._source) {
            const it = source[Symbol.iterator]();
            error = null;
            hasError = false;
            while (1) {
                let c = {};
                try {
                    const { done, value } = it.next();
                    if (done) {
                        returnIterator(it);
                        break;
                    }
                    c = value;
                }
                catch (e) {
                    error = e;
                    hasError = true;
                    returnIterator(it);
                    break;
                }
                yield c;
            }
            if (!hasError) {
                break;
            }
        }
        if (hasError) {
            throw error;
        }
    }
}
/**
 * Creates a sequence by concatenating source sequences until a source sequence completes successfully.
 * @param {Iterable<Iterable<TSource>>} source Source sequences.
 * @return {Iterable<TSource>} Sequence that continues to concatenate source sequences while errors occur.
 */
export function catchAll(source) {
    return new CatchIterable(source);
}
/**
 * Creates a sequence by concatenating source sequences until a source sequence completes successfully.
 * @param {...Iterable<TSource>} source Sequence that continues to concatenate source sequences while errors occur.
 * @return {Iterable<TSource>} Sequence that continues to concatenate source sequences while errors occur.
 */
export function catchError(...source) {
    return new CatchIterable(source);
}

//# sourceMappingURL=catcherror.mjs.map
