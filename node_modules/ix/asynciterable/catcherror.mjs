import { AsyncIterableX } from './asynciterablex';
import { returnAsyncIterator } from '../util/returniterator';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
export class CatchAllAsyncIterable extends AsyncIterableX {
    _source;
    constructor(source) {
        super();
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let error = null;
        let hasError = false;
        for (const source of this._source) {
            const it = wrapWithAbort(source, signal)[Symbol.asyncIterator]();
            error = null;
            hasError = false;
            while (1) {
                let c = {};
                try {
                    const { done, value } = await it.next();
                    if (done) {
                        await returnAsyncIterator(it);
                        break;
                    }
                    c = value;
                }
                catch (e) {
                    error = e;
                    hasError = true;
                    await returnAsyncIterator(it);
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
 * Continues an async-iterable sequence that is terminated by an exception with the next async-iterable sequence.
 *
 * @template T The type of the elements in the source and handler sequences.
 * @param {Iterable<AsyncIterable<T>>} source async-iterable sequences to catch exceptions for.
 * @returns {AsyncIterableX<T>} An async-iterable sequence containing elements from consecutive source
 * sequences until a source sequence terminates successfully.
 */
export function catchAll(source) {
    return new CatchAllAsyncIterable(source);
}
/**
 * Continues an async-iterable sequence that is terminated by an exception with the next async-iterable sequence.
 *
 * @template T The type of the elements in the source and handler sequences.
 * @param {...AsyncIterable<T>[]} args async-iterable sequences to catch exceptions for.
 * @returns {AsyncIterableX<T>} An async-iterable sequence containing elements from consecutive source
 * sequences until a source sequence terminates successfully.
 */
export function catchError(...args) {
    return new CatchAllAsyncIterable(args);
}

//# sourceMappingURL=catcherror.mjs.map
