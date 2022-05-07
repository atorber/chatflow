import { AsyncIterableX } from './asynciterablex';
import { wrapWithAbort } from './operators/withabort';
import { throwIfAborted } from '../aborterror';
class WhileAsyncIterable extends AsyncIterableX {
    _condition;
    _source;
    constructor(condition, source) {
        super();
        this._condition = condition;
        this._source = source;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        while (await this._condition(signal)) {
            for await (const item of wrapWithAbort(this._source, signal)) {
                yield item;
            }
        }
    }
}
/**
 * Repeats the given source as long as the specified conditions holds, where
 * the condition is evaluated before each repeated source is iterated.
 *
 * @template TSource
 * @param {AsyncIterable<TSource>} source Source to repeat as long as the condition function evaluates to true.
 * @param {((signal?: AbortSignal) => boolean | Promise<boolean>)} condition Condition that will be evaluated before the source sequence is iterated.
 * @returns {AsyncIterableX<TSource>} An async-iterable which is repeated while the condition returns true.
 */
export function whileDo(source, condition) {
    return new WhileAsyncIterable(condition, source);
}

//# sourceMappingURL=whiledo.mjs.map
