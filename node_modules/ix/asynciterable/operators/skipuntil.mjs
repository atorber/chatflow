import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class SkipUntilAsyncIterable extends AsyncIterableX {
    _source;
    _other;
    constructor(source, other) {
        super();
        this._source = source;
        this._other = other;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let otherDone = false;
        this._other(signal).then(() => (otherDone = true));
        for await (const item of wrapWithAbort(this._source, signal)) {
            if (otherDone) {
                yield item;
            }
        }
    }
}
/**
 * Returns the elements from the source observable sequence only after the function that returns a promise produces an element.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {(signal?: AbortSignal) => Promise<any>} other A function which returns a promise that triggers propagation
 * of elements of the source sequence.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An async-iterable sequence containing the elements of the source sequence
 * starting from the point the function that returns a promise triggered propagation.
 */
export function skipUntil(other) {
    return function skipUntilOperatorFunction(source) {
        return new SkipUntilAsyncIterable(source, other);
    };
}

//# sourceMappingURL=skipuntil.mjs.map
