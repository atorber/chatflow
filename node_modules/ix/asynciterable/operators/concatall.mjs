import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class ConcatAllAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        for await (const outer of wrapWithAbort(this._source, signal)) {
            for await (const item of wrapWithAbort(outer, signal)) {
                yield item;
            }
        }
    }
}
/**
 * Concatenates all inner async-iterable sequences, as long as the previous
 * async-iterable sequence terminated successfully.
 *
 * @template T The type of elements in the source sequence.
 * @returns {OperatorAsyncFunction<AsyncIterable<T>, T>} An operator which concatenates all inner async-iterable sources.
 */
export function concatAll() {
    return function concatAllOperatorFunction(source) {
        return new ConcatAllAsyncIterable(source);
    };
}

//# sourceMappingURL=concatall.mjs.map
