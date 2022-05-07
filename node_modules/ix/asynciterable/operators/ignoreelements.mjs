import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class IgnoreElementsAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        // eslint-disable-next-line no-empty
        for await (const _ of wrapWithAbort(this._source, signal)) {
        }
    }
}
/**
 * Ignores all elements in an async-iterable sequence leaving only the termination messages.
 *
 * @template TSource The type of the elements in the source sequence
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that returns an empty async-iterable sequence
 * that signals termination, successful or exceptional, of the source sequence.
 */
export function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return new IgnoreElementsAsyncIterable(source);
    };
}

//# sourceMappingURL=ignoreelements.mjs.map
