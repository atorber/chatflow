import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class FinallyAsyncIterable extends AsyncIterableX {
    _source;
    _action;
    constructor(source, action) {
        super();
        this._source = source;
        this._action = action;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        try {
            for await (const item of wrapWithAbort(this._source, signal)) {
                yield item;
            }
        }
        finally {
            await this._action();
        }
    }
}
/**
 *  Invokes a specified asynchronous action after the source async-iterable sequence terminates gracefully or exceptionally.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {(() => void | Promise<void>)} action Action to invoke and await asynchronously after the source async-iterable sequence terminates
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator that returns the source sequence with the
 * action-invoking termination behavior applied.
 */
export function finalize(action) {
    return function finalizeOperatorFunction(source) {
        return new FinallyAsyncIterable(source, action);
    };
}

//# sourceMappingURL=finalize.mjs.map
