import { AsyncIterableX } from './asynciterablex';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
export class ConcatAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for (const outer of this._source) {
            for await (const item of wrapWithAbort(outer, signal)) {
                yield item;
            }
        }
    }
}
export function _concatAll(source) {
    return new ConcatAsyncIterable(source);
}
/**
 * Concatenates all async-iterable sequences in the given sequences, as long as the previous async-iterable
 * sequence terminated successfully.
 *
 * @template T The type of the elements in the sequences.
 * @param {...AsyncIterable<T>[]} args The async-iterable sources.
 * @returns {AsyncIterableX<T>} An async-iterable sequence that contains the elements of each given sequence, in sequential order.
 */
export function concat(...args) {
    return new ConcatAsyncIterable(args);
}

//# sourceMappingURL=concat.mjs.map
