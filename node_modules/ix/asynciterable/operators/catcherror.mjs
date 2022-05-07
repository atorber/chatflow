import { AsyncIterableX } from '../asynciterablex';
import { returnAsyncIterator } from '../../util/returniterator';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class CatchWithAsyncIterable extends AsyncIterableX {
    _source;
    _handler;
    constructor(source, handler) {
        super();
        this._source = source;
        this._handler = handler;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let err;
        let hasError = false;
        const source = wrapWithAbort(this._source, signal);
        const it = source[Symbol.asyncIterator]();
        while (1) {
            let c = {};
            try {
                c = await it.next();
                if (c.done) {
                    await returnAsyncIterator(it);
                    break;
                }
            }
            catch (e) {
                err = await this._handler(e, signal);
                hasError = true;
                await returnAsyncIterator(it);
                break;
            }
            yield c.value;
        }
        if (hasError) {
            for await (const item of wrapWithAbort(err, signal)) {
                yield item;
            }
        }
    }
}
/**
 * Continues an async-iterable sequence that is terminated by an exception with the
 * async-iterable sequence produced by the handler.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of elements from the handler function.
 * @param {((
 *     error: any,
 *     signal?: AbortSignal
 *   ) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>)} handler Error handler function, producing another async-iterable sequence.
 * @returns {(OperatorAsyncFunction<TSource, TSource | TResult>)} An operator which continues an async-iterable sequence that is terminated by
 * an exception with the specified handler.
 */
export function catchError(handler) {
    return function catchWithOperatorFunction(source) {
        return new CatchWithAsyncIterable(source, handler);
    };
}

//# sourceMappingURL=catcherror.mjs.map
