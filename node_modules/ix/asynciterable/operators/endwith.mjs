import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class EndWithAsyncIterable extends AsyncIterableX {
    _source;
    _args;
    constructor(source, args) {
        super();
        this._source = source;
        this._args = args;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for await (const item of wrapWithAbort(this._source, signal)) {
            yield item;
        }
        for (const x of this._args) {
            yield x;
        }
    }
}
/**
 * Append values to an async-iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {...TSource[]} args The values to append to the end of the async-iterable sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator which appends values to the end of the sequence.
 */
export function endWith(...args) {
    return function endsWithOperatorFunction(source) {
        return new EndWithAsyncIterable(source, args);
    };
}

//# sourceMappingURL=endwith.mjs.map
