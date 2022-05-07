import { AsyncIterableX } from '../asynciterablex';
import { wrapWithAbort } from './withabort';
import { throwIfAborted } from '../../aborterror';
export class TakeWhileAsyncIterable extends AsyncIterableX {
    _source;
    _predicate;
    constructor(source, predicate) {
        super();
        this._source = source;
        this._predicate = predicate;
    }
    async *[Symbol.asyncIterator](signal) {
        throwIfAborted(signal);
        let i = 0;
        for await (const item of wrapWithAbort(this._source, signal)) {
            if (!(await this._predicate(item, i++, signal))) {
                break;
            }
            yield item;
        }
    }
}
/**
 * Returns elements from an async-iterable sequence as long as a specified condition is true.
 *
 * @template T The type of the elements in the source sequence.
 * @param {((value: T, index: number, signal?: AbortSignal) => boolean | Promise<boolean>)} predicate A function to test each element for a condition.
 * @returns {OperatorAsyncFunction<T, T>} An async-iterable sequence that contains the elements from the input sequence that occur
 * before the element at which the test no longer passes.
 */
export function takeWhile(predicate) {
    return function takeWhileOperatorFunction(source) {
        return new TakeWhileAsyncIterable(source, predicate);
    };
}

//# sourceMappingURL=takewhile.mjs.map
