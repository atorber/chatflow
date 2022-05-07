import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class MapAsyncIterable extends AsyncIterableX {
    _source;
    _selector;
    _thisArg;
    constructor(source, selector, thisArg) {
        super();
        this._source = source;
        this._selector = selector;
        this._thisArg = thisArg;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let i = 0;
        for await (const item of wrapWithAbort(this._source, signal)) {
            const result = await this._selector.call(this._thisArg, item, i++, signal);
            yield result;
        }
    }
}
/**
 * Projects each element of an async-enumerable sequence into a new form.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the result sequence, obtained by running the selector
 * function for each element in the source sequence.
 * @param {((value: TSource, index: number, signal?: AbortSignal) => Promise<TResult> | TResult)} selector A transform function
 * to apply to each source element.
 * @param {*} [thisArg] Optional this for binding to the selector.
 * @returns {OperatorAsyncFunction<TSource, TResult>} An async-iterable sequence whose elements are the result of invoking the transform
 * function on each element of source.
 */
export function map(selector, thisArg) {
    return function mapOperatorFunction(source) {
        return new MapAsyncIterable(source, selector, thisArg);
    };
}

//# sourceMappingURL=map.mjs.map
