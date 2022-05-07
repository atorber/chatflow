import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class ReverseAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const results = [];
        for await (const item of wrapWithAbort(this._source, signal)) {
            results.unshift(item);
        }
        yield* results;
    }
}
/**
 * Reverses the async-iterable instance.
 *
 * @template TSource The type of the elements in the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} The async-iterable in reversed sequence.
 */
export function reverse() {
    return function reverseOperatorFunction(source) {
        return new ReverseAsyncIterable(source);
    };
}

//# sourceMappingURL=reverse.mjs.map
