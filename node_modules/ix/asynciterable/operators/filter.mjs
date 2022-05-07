import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class FilterAsyncIterable extends AsyncIterableX {
    _source;
    _predicate;
    _thisArg;
    constructor(source, predicate, thisArg) {
        super();
        this._source = source;
        this._predicate = predicate;
        this._thisArg = thisArg;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let i = 0;
        for await (const item of wrapWithAbort(this._source, signal)) {
            if (await this._predicate.call(this._thisArg, item, i++)) {
                yield item;
            }
        }
    }
}
/**
 * Filters the elements of an async-iterable sequence based on a predicate.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {((value: TSource, index: number, signal?: AbortSignal) => boolean | Promise<boolean>)} predicate A function to test each source element
 * for a condition.
 * @param {*} [thisArg] Optional this for binding.
 * @returns {OperatorAsyncFunction<TSource, TSource>} An operator which returns an async-iterable
 * sequence that contains elements from the input sequence that satisfy the condition.
 */
export function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return new FilterAsyncIterable(source, predicate, thisArg);
    };
}

//# sourceMappingURL=filter.mjs.map
