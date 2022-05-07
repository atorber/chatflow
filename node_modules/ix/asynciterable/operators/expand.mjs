import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class ExpandAsyncIterable extends AsyncIterableX {
    _source;
    _selector;
    constructor(source, selector) {
        super();
        this._source = source;
        this._selector = selector;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        const q = [this._source];
        while (q.length > 0) {
            const src = q.shift();
            for await (const item of wrapWithAbort(src, signal)) {
                const items = await this._selector(item, signal);
                q.push(items);
                yield item;
            }
        }
    }
}
/**
 * Expands (breadth first) the async-iterable sequence by recursively applying a selector function to generate more sequences at each recursion level.
 *
 * @template TSource Source sequence element type.
 * @param {((
 *     value: TSource,
 *     signal?: AbortSignal
 *   ) => AsyncIterable<TSource> | Promise<AsyncIterable<TSource>>)} selector Selector function to retrieve the next sequence to expand.
 * @returns {MonoTypeOperatorAsyncFunction<TSource>} An operator which returns a sequence with results
 * from the recursive expansion of the source sequence.
 */
export function expand(selector) {
    return function expandOperatorFunction(source) {
        return new ExpandAsyncIterable(source, selector);
    };
}

//# sourceMappingURL=expand.mjs.map
